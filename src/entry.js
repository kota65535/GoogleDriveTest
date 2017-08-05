/**
 * Created by tozawa on 2017/07/23.
 */

import 'jquery'
import 'jquery-selector-cache';
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-notify';
import {GoogleAuthAPI} from "./GoogleAuthAPI";
import {GoogleDriveAPI} from "./GoogleDriveAPI";


var SCOPE ='https://www.googleapis.com/auth/docs';

var googleAuth;
var googlePicker;

var editingFileId;

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


function enableSaveFileButton(fileId) {
    $$('#save-file').removeClass("disabled");
    $$('#save-file').on('click', (e) => {
        let content = $$('#file-content').val();
        googlePicker.updateFile(editingFileId, content)
            .then(resp => {
                $.notify({
                    message: `File "${resp.result.name}" saved, content: ${content}`
                },{
                    type: 'info'
                });
            })
    });
    editingFileId = fileId;
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


    $$('#open-save-file-as-dialog').on('click', (e) => {
        $$('#save-file-as-dialog').modal('show');
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


    $$('#save-file-as').on('click', (e) => {
        let fileName = $$('#file-name').val();
        let parentId = $$('#folder-id').val();
        let content = $$('#file-content').val();

        if (!fileName) {
            $.notify({
                message: "File name is empty."
            }, {
                // element: "save-file-as",
                type: "danger",
                z_index: 10000,
                delay: 2000,
                placement: {
                    align: "center"
                }
            })
            return
        }

        // ファイルを所定のフォルダに作成し、さらに中身を書き込む
        googlePicker.createFile(fileName, 'application/json', [parentId])
            .then(resp => {
                googlePicker.updateFile(resp.result.id, content)
                    .then(resp => {
                        $.notify({
                            message: `File "${resp.result.name}", content: ${content}`
                        },{
                            type: 'info'
                        });
                        enableSaveFileButton(resp.result.id);
                    }, resp => {
                        console.log(resp);
                    })
            });

        // ダイアログを閉じる
        $$('#save-file-as-dialog').modal('hide');
    });

    $$('#save-file').addClass("disabled");

    $$('#load-file').on('click', (e) => {
        googlePicker.showFilePicker( null, pickerEvent => {
            switch(pickerEvent.action) {
                case "loaded":
                    break;
                case "picked":
                    let file = pickerEvent.docs[0];
                    googlePicker.downloadFile(file.id)
                        .then(resp => {
                            $$('#file-content').val(resp.body);
                            $.notify({
                                message: `File "${file.name}" loaded.`
                            },{
                                type: 'info'
                            });
                            enableSaveFileButton(file.id);
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
