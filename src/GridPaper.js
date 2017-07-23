

export class GridPaper {

    constructor(canvasId, boardWidth, boardHeight, gridSize,
                initialZoom, zoomUnit, zoomMin, zoomMax) {
        this.canvasId = canvasId;
        this.canvasElem = $("#" + canvasId)[0];
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.gridSize = gridSize;

        this.cursorPoint;        // ページ上のマウスカーソルの位置
        this.cursorDelta;        // ページ上のマウスカーソルの前フレーム位置との差分
        this.canvasPoint;        // キャンバス上のマウスカーソルの位置
        this.viewCenterMin;      // ビュー中心点の最小(左上)位置
        this.viewCenterMax;      // ビュー中心点の最大(右下)位置
        this.initialViewSize;    // 初期ビューサイズ
        this.boardMin;           // ボードの最小(左上)位置
        this.boardMax;           // ボードの最大(右下)位置
        this.shouldModifyViewCenter = true;      // ビュー中心点が移動可能範囲を超えたときに修正するか否かのフラグ

        this.initialZoom = initialZoom;
        this.zoomUnit = zoomUnit;
        this.zoomMin = zoomMin;
        this.zoomMax = zoomMax;
    }

    init() {
        // center of the view at first
        new Path.Circle({
            center: view.center,
            radius: 50,
            fillColor: 'blue'
        });

        // right bottom of the view
        new Path.Circle({
            center: new Point(this.canvasElem.width, this.canvasElem.height),
            radius: 50,
            fillColor: 'blue'
        });

        // center of the board & top-left of the view at first
        new Path.Circle({
            center: new Point(0, 0),
            radius: 50,
            fillColor: 'blue'
        });


        this.initialViewSize = new Size(view.size);
        this.viewCenterMin = new Point(view.size.width - this.boardWidth / 2, view.size.height - this.boardHeight / 2);
        this.viewCenterMax = new Point(this.boardWidth / 2, this.boardHeight / 2);
        this.boardMin = new Point(view.size.width / 2 - this.boardWidth / 2, view.size.height / 2 - this.boardHeight / 2);
        this.boardMax = new Point(view.size.width / 2 + this.boardWidth / 2, view.size.height / 2 + this.boardHeight / 2);

        console.log("viewCenterMin ", this.viewCenterMin);
        console.log("viewCenterMax ", this.viewCenterMax);
        console.log("boardMin ", this.boardMin);
        console.log("boardMax ", this.boardMax);

        // top-left of the board
        new Path.Circle({
            center: this.boardMin,
            radius: 100,
            fillColor: 'green'
        });

        // bottom-right of the board
        new Path.Circle({
            center: this.boardMax,
            radius: 100,
            fillColor: 'green'
        });

        // top-left of the center of view
        new Path.Circle({
            center: this.viewCenterMin,
            radius: 50,
            fillColor: 'red'
        });

        // bottom-right of the center of view
        new Path.Circle({
            center: this.viewCenterMax,
            radius: 50,
            fillColor: 'red'
        });

//        new Path.Circle({
//            center: new Point(-width, height*2),
//            radius: 100,
//            fillColor: 'green'
//        });
//        new Path.Circle({
//            center: new Point(width*2, height*2),
//            radius: 100,
//            fillColor: 'green'
//        });
//        new Path.Circle({
//            center: new Point(width*2, -height),
//            radius: 100,
//            fillColor: 'green'
//        });
//        new Path.Circle({
//            center: new Point(width*2, 0),
//            radius: 100,
//            fillColor: 'green'
//        });
//        new Path.Circle({
//            center: new Point(width*2, height),
//            radius: 100,
//            fillColor: 'green'
//        });
//        new Path.Circle({
//            center: new Point(width*2, height*2),
//            radius: 100,
//            fillColor: 'green'
//        });

        this._createGrids(this.gridSize);
    }

    _createGrids(size) {
        let rangeX = _.range(Math.floor(this.boardMin.x / size), Math.floor(this.boardMax.x / size));
        let rangeY = _.range(Math.floor(this.boardMin.y / size), Math.floor(this.boardMax.y / size));
        // 縦線
        rangeX.forEach( (i) => {
            let line = new Path.Line(new paper.Point(size * i, this.boardMin.y), new paper.Point(size * i, this.boardMax.y));
            if (i === 0) {
                line.strokeColor = 'red';
                line.strokeWidth = 3;
            } else if (i % 4 === 0) {
                line.strokeColor = 'grey';
                line.strokeWidth = 3;
            } else {
                line.strokeColor = 'grey';
            }
        });
        // 横線
        rangeY.forEach( (i) => {
            let line = new Path.Line(new paper.Point(this.boardMin.x, size*i), new paper.Point(this.boardMax.x, size*i));
            if (i === 0) {
                line.strokeColor = 'red';
                line.strokeWidth = 3;
            } else if (i % 4 ===0) {
                line.strokeColor = 'grey';
                line.strokeWidth = 3;
            } else {
                line.strokeColor = 'grey';
            }
        })
    }

    paperOnMouseMove(event) {
//        view.viewSize = new Size(view.size.width/2, view.size.height/2);

        $("#canvasSize")[0].innerHTML = "canvas size: " + $("#myCanvas")[0].width + ", " + $("#myCanvas")[0].height;
        $("#viewSize")[0].innerHTML = "view size: " + view.size.width + ", " + view.size.height;

    }


    // カーソルの移動量に応じてビューを移動させる。
    // 移動量はページ上のマウスカーソルの位置を利用する。
    // 注: キャンバス上のマウスカーソルの位置は使えない。
    paperOnMouseDrag(event) {
        // 移動量をスケールに応じて変化させる
        let moveUnit = 1 / view.getScaling().x;
        let nextCenter = view.center.subtract(this.cursorDelta.multiply(moveUnit));

        if (this.shouldModifyViewCenter) {
            // ビューの中心点が移動可能領域からはみ出さないようにする
            if ( nextCenter.x < this.viewCenterMin.x ) {
                nextCenter = new Point(this.viewCenterMin.x, nextCenter.y);
            }
            if ( this.viewCenterMax.x < nextCenter.x ) {
                nextCenter = new Point(this.viewCenterMax.x, nextCenter.y);
            }
            if ( nextCenter.y < this.viewCenterMin.y ) {
                nextCenter = new Point(nextCenter.x, this.viewCenterMin.y);
            }
            if ( this.viewCenterMax.y < nextCenter.y ) {
                nextCenter = new Point(nextCenter.x, this.viewCenterMax.y);
            }
        }

        view.center = nextCenter;

        $("#viewRange")[0].innerHTML = "view range: (" + this.viewCenterMin.x + "," + this.viewCenterMin.y + ") - (" + this.viewCenterMax.x + "," + this.viewCenterMax.y + ")";
        $("#viewCenter")[0].innerHTML = "view center: " + view.center.x + ", " + view.center.y;
    }


    windowOnMouseMove(e) {
        // ページ上のマウスカーソルの位置を更新
        var cursorBefore = this.cursorPoint;
        this.cursorPoint = new Point(e.pageX, e.pageY);
        this.cursorDelta = this.cursorPoint.subtract(cursorBefore);

        // キャンバス上のマウスカーソルの位置を更新
        var point = paper.DomEvent.getOffset(e, $('#myCanvas')[0]);
        this.canvasPoint = paper.view.viewToProject(point);

        $("#cursorPoint")[0].innerHTML = "cursor point: " + this.cursorPoint.x + ", " + this.cursorPoint.y;
        $("#cursorDelta")[0].innerHTML = "cursor delta: " + this.cursorDelta.x + ", " + this.cursorDelta.y;
        $("#canvasPoint")[0].innerHTML = "canvas point: " + point.x + ", " + point.y;
    }

    // ホイールの移動量に応じてビューを拡大・縮小する。
    windowOnMouseWheel(e) {
        $("#wheelDelta")[0].innerHTML = "wheelDelta: " + e.wheelDelta;

        // scale()に与える率は、現在からの相対値
        let newRelativeScale = 1 + this.zoomUnit * e.wheelDelta;
        let newScale = view.getScaling().x * newRelativeScale;

        // 最大拡大率・最小縮小率を超えないようにする
        if (newScale < this.zoomMin) {
            newRelativeScale = this.zoomMin / view.getScaling().x;
        }
        if (this.zoomMax < newScale) {
            newRelativeScale = this.zoomMax / view.getScaling().x;
        }

        view.scale(newRelativeScale, this.canvasPoint);
        console.info("currentZoom: ", newScale);

        $("#viewSize")[0].innerHTML = "view size: " + view.size.width + ", " + view.size.height;

        // ビューの端がボードの範囲を超えないよう、ビュー中心の移動可能範囲を変更する
        if (view.size.width < this.boardWidth && view.size.height < this.boardHeight) {
            this.viewCenterMin = new Point(
                this.initialViewSize.width / 2 + view.size.width / 2 - this.boardWidth / 2,
                this.initialViewSize.height / 2 + view.size.height / 2 - this.boardHeight / 2);
            this.viewCenterMax = new Point(
                this.initialViewSize.width / 2 - view.size.width / 2 + this.boardWidth / 2,
                this.initialViewSize.height / 2 - view.size.height / 2 + this.boardHeight / 2);
            this.shouldModifyViewCenter = true;
        } else {
            // ビューサイズがボードの幅または高さを超えた場合は、ビューの中心点の修正を行わない。
            this.shouldModifyViewCenter = false;
        }
    }
}

