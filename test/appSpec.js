import assert from 'power-assert';
import {GoogleAuthAPI} from "../src/GoogleAuthAPI";
import {HogeClass} from "../src/HogeClass";

describe('unko chinchin', () => {
    it('readFile', (done) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(10);
            }, 1000)
        }).then((a) => {
            expect(10).toBe(a);
            done(); // ここでテストが終了する
        });
    });

    it('aaa', (done) => {
        let googleAuth = new GoogleAuthAPI(
            'AIzaSyB6Jfd-o3v5RafVjTNnkBevhjX3_EHqAlE',
            '658362738764-9kdasvdsndig5tsp38u7ra31fu0e7l5t.apps.googleusercontent.com',
            'https://www.googleapis.com/auth/docs',
            ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            () => {
                done();
                assert(false);
            }, () => {
                done();
                assert(false);
            });
    })
    it('bbb', () => {
        expect(new HogeClass().getHoge()).toBe("hoge");
    })
});

// describe('It goes', function() {
//     beforeEach(function(done) {
//         setTimeout(function() {
//             value = 0;
//             done();
//         }, 1)
//     });
//     it("should support async execution of test preparation and expectations", function(done) {
//         value++;
//         expect(value).toBeGreaterThan(0);
//         done();
//     });
//
//     it('1 + 2 は 43', function() {
//         let googleAuth = new GoogleAuthAPI(
//             'AIzaSyB6Jfd-o3v5RafVjTNnkBevhjX3_EHqAlE',
//             '658362738764-9kdasvdsndig5tsp38u7ra31fu0e7l5t.apps.googleusercontent.com',
//             'https://www.googleapis.com/auth/docs',
//             ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
//             null, null);
//         expect(4).toBe(4);
//     });
// });