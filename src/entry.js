/**
 * Created by tozawa on 2017/07/23.
 */

import 'jquery'
import "jquery-selector-cache";
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
import {GoogleAuthAPI} from "./GoogleAuthAPI";
import {GoogleDriveAPI} from "./GoogleDriveAPI";


var SCOPE ='https://www.googleapis.com/auth/docs';

var googleAuth;
var googlePicker;

function onLoaded(isSignedIn) {
    onSignInStatusChanged(isSignedIn);
}

function onSignInStatusChanged(isSignedIn) {
    let user = googleAuth.getCurrentUser();
    let isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
        $('#sign-in-or-out-button').html('Sign out');
        $('#revoke-access-button').css('display', 'inline-block');
        $('#auth-status').html('You are currently signed in and have granted ' +
            'access to this app.');
        console.log(user);
        console.log(user.getAuthResponse().access_token);

        googlePicker = new GoogleDriveAPI(
            'AIzaSyB6Jfd-o3v5RafVjTNnkBevhjX3_EHqAlE',
            user.getAuthResponse().access_token
        );

    } else {
        $('#sign-in-or-out-button').html('Sign In/Authorize');
        $('#revoke-access-button').css('display', 'none');
        $('#auth-status').html('You have not authorized this app or you are ' +
            'signed out.');
    }
}



window.handleClientLoad = () => {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    googleAuth = new GoogleAuthAPI(
        'AIzaSyB6Jfd-o3v5RafVjTNnkBevhjX3_EHqAlE',
        '658362738764-9kdasvdsndig5tsp38u7ra31fu0e7l5t.apps.googleusercontent.com',
        SCOPE,
        ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        onLoaded,
        onSignInStatusChanged
    )
    // gapi.signin2.render("my-signin2");
    // console.info(googleAuth.getCurrentUser());
}

window.onload = function () {

    $$("#sign-in-or-out-button").on("click", (e) => {
        if (googleAuth.isSignedIn()) {
            // User is authorized and has clicked 'Sign out' button.
            googleAuth.signOut();
        } else {
            // User is not signed in. Start Google auth flow.
            googleAuth.signIn();
        }
    });


    $$('#open-save-file-dialog').on('click', (e) => {
        $$('#save-file-dialog').modal('show');
    });


    $$('#select-folder').on('click', (e) => {
        googlePicker.showFolderPicker(null, pickerEvent => {
            switch(pickerEvent.action) {
                case "loaded":
                    break;
                case "picked":
                    let folderId = pickerEvent.docs[0].id;
                    $$('#folder-id').val(folderId);
                    googlePicker.getFilePath(folderId)
                        .then(path => {
                            console.log(`File path: ${path}`);
                            $$('#select-folder').val(path);
                        });
                    break;
            }
        });
    });


    $$('#save-file').on('click', (e) => {
        let fileName = $$('#file-name').val();
        let parentId = $$('#folder-id').val();
        let content = $$('#file-content').val();

        // ファイルを所定のフォルダに作成する
        googlePicker.createFile(fileName, 'application/json', [parentId])
            .then(resp => {
                if (!content) return;

                // 中身があれば更新する
                googlePicker.updateFile(resp.result.id, content)
                    .then(resp => {
                        console.log(`File saved: fileName: ${fileName}, content: ${content}`);
                        // flash("UNKO!");
                        $.alert("Alert Message", "Alert Title")

                    }, resp => {
                        console.log(resp);
                    })
            });

        // ダイアログを閉じる
        $$('#save-file-dialog').modal('hide');
    });


    $$('#load-file').on('click', (e) => {
        googlePicker.showFilePicker( null, pickerEvent => {
            switch(pickerEvent.action) {
                case "loaded":
                    break;
                case "picked":
                    let fileId = pickerEvent.docs[0].id;
                    googlePicker.downloadFile(fileId)
                        .then(resp => {
                            $$('#file-content').val(resp.body);
                        });
                    break;
            }
        });
    });

    $$('#reset-folder').on('click', (e) => {
        $$('#select-folder').val('My Drive');
        $$('#folder-id').val('root');
    });

    $$('#reset-folder').trigger('click');
};
