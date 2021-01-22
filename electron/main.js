/* eslint-disable default-case */
const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");
const fs = require("fs");
const path = require("path");
const url = require("url");
const watch = require("node-watch");
const os = require("os");
const cp = require("child_process");
const { google } = require("googleapis");
const readline = require("readline");
const { getPort } = require("portfinder");
const express = require("express");

const VIDEO_CODEC = "libmp3lame"; // aac, copy - https://ffmpeg.zeranoe.com/forum/viewtopic.php?t=2296
const MAIN_WINDOW_WIDTH = 850;
const MAIN_WINDOW_HEIGHT = 660;
const AUTH_WINDOW_WIDTH = 800;
const AUTH_WINDOW_HEIGHT = 600;
const CLIENT_ID = "";
const CLIENT_SECRET = "";

let mainWindow;
let authWindow;


let isIdle = true;

app.on("ready", () => {

    mainWindow = new BrowserWindow({
        width: MAIN_WINDOW_WIDTH,
        height: MAIN_WINDOW_HEIGHT,
        resizable: false,
        fullscreenable: false,
        frame: false,
        // transparent: true,
        // backgroundColor: "#00FF00",
        // titleBarStyle: "hidden",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            webSecurity: false // BAD PRACTICE, SEE: https://stackoverflow.com/questions/45554249/playing-local-mp4-file-in-electron
        }
    });
    // mainWindow.hide();

    const notify = (title, body) => {
        mainWindow.webContents.send("notification-event", {
            title: title,
            body: body
        });
    };
    const alert = (data) => {
        mainWindow.webContents.send("alert-event", data);
    };
    // const iosNotifyCopying = () => {
    //     mainWindow.webContents.send("iosNotificationCopying-event");
    // };
    // const iosNotifyProcessing = () => {
    //     mainWindow.webContents.send("iosNotificationProcessing-event");
    // };
    const setProcessingMessage = (message) => {
        mainWindow.webContents.send("processing-event", message);
    };
    const setUploadable = (bool) => {
        mainWindow.webContents.send("uploadButton-event", bool);
    }
    // const loadVideoSrc = (bool) => {
    //     if (bool) {
    //         mainWindow.webContents.send("video-event", `file://${os.homedir()}/Library/Application Support/IU Video Uploader/store/video/video-concat/final.mp4`);
    //     } else {
    //         mainWindow.webContents.send("video-event", null);
    //     }
    // }

    mainWindow.loadURL(process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, "../index.html"),
        protocol: "file:",
        slashes: true,
    }));

    // watch("/Volumes", (event, path) => {
    //     switch (path) {
    //         case "/Volumes/DVD_VIDEO_RECORDER": // DVD
    //             switch (event) {
    //                 case "update":
    //                     if (isIdle) {
    //                         isIdle = false;
    //                         console.log("DVD inserted");
    //                         mainWindow.show();
    //                         mainWindow.webContents.send("removableStorage-event", {
    //                             event: "inserted",
    //                             storageType: "DVD"
    //                         });
    //                         mainWindow.webContents.send("upload-event", null);
    //                         loadVideoSrc(false);
    //                         setProcessingMessage("Removing old videos from processing directories...");
    //                         cp.exec("rm -f ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-pre/* ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-pre/.[!.]* ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-post/* ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-post/.[!.]* ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-concat/* ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-concat/.[!.]*", () => {
    //                             // Wait for files on disk to become available
    //                             while (!fs.existsSync("/Volumes/DVD_VIDEO_RECORDER/VIDEO_TS/VTS_01_1.VOB")){}
    //                             setProcessingMessage("Copying VOB files from disk...");
    //                             cp.exec(`cp ${path}/VIDEO_TS/*_1.VOB ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-pre`, ()=> {
    //                                 notify("Copying Completed", "You may take the disk while the videos are being converted.");
    //                                 iosNotifyCopying();
    //                                 cp.exec("drutil tray eject");
    //                                 setProcessingMessage("Converting VOB files to MP4 file...");
    //                                 fs.readdir(`${os.homedir()}/Library/Application Support/IU Video Uploader/store/video/video-pre`, (err, files) => {
    //                                     let ffmpegCommand = "";
    //                                     files.forEach((fileName) => {
    //                                         const i = fileName.substring(4, fileName.length - 6);
    //                                         ffmpegCommand += `./ffmpeg -i ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-pre/VTS_${i}_1.VOB -acodec ${VIDEO_CODEC} -ac 2 -ar 22050 ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-post/${Number(i)}.mp4 && `;
    //                                     });
    //                                     ffmpegCommand = "cd ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/bin && " + ffmpegCommand.substring(0, ffmpegCommand.length - 4);
    //                                     // console.log("ffmpegCommand:\n"+ffmpegCommand);
    //                                     cp.exec(ffmpegCommand, () => {
    //                                         let concatCommand = "";
    //                                         for (let i=1; i<=files.length; i++) {
    //                                             concatCommand += `file '../video-post/${i}.mp4'\n`;
    //                                         }
    //                                         concatCommand = `cd ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-concat && echo "${concatCommand.substring(0, concatCommand.length-1)}" > files.txt`;
    //                                         cp.exec(concatCommand, () => {
    //                                             cp.exec("cd ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/bin && ./ffmpeg -f concat -safe 0 -i ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-concat/files.txt -c copy ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-concat/final.mp4", () => {
    //                                                 mainWindow.show();
    //                                                 notify("Conversion Completed", "You may now upload the video to YouTube.");
    //                                                 iosNotifyProcessing();
    //                                                 setProcessingMessage("Processing completed");
    //                                                 setUploadable(true);
    //                                                 loadVideoSrc(true);
    //                                             });
    //                                         });
    //                                     });
    //                                 });
    //                             });
    //                         });
    //                     } else {
    //                         console.log("DVD inserted, but main process is busy");
    //                         cp.exec("drutil tray eject");
    //                     }
    //                     break;
    //                 case "remove":
    //                     console.log("DVD removed");
    //                     mainWindow.webContents.send("removableStorage-event", {
    //                         event: "removed",
    //                         storageType: ""
    //                     });
    //                     break;
    //             }
    //             break;
    //         case "/Volumes/FLASH_DRIVE": // Flash drive
    //             switch (event) {
    //                 case "update":
    //                     console.log("Flash drive inserted");
    //                     mainWindow.show();
    //                     mainWindow.webContents.send("removableStorage-event", {
    //                         event: "inserted",
    //                         storageType: "Flash Drive"
    //                     });
    //                     break;
    //                 case "remove":
    //                     console.log("Flash drive removed");
    //                     mainWindow.webContents.send("removableStorage-event", {
    //                         event: "removed",
    //                         storageType: ""
    //                     });
    //                     break;
    //             }
    //             break;
    //         default: // Something else
    //             console.log("Some action occured with another path");
    //             break;
    //     }
    // });

    ipcMain.on("button-upload", (event, data) => {
        console.log("pressed");
    });

    app.on("activate", () => {
        mainWindow.show();
    });

    mainWindow.on("closed", () => {
        console.log("'closed' event fired");
        // Add exec commands to kill ffmpeg and node if you want
        mainWindow = null;
    });

    ipcMain.on("button-test-copying", () => {
        // iosNotifyCopying();
    });
    ipcMain.on("button-test-processing", () => {
        // iosNotifyProcessing();
    });

    ipcMain.on("button-hide", () => {
        mainWindow.hide();
    });

    ipcMain.on("button-loadVideoSrc", () => {
        loadVideoSrc(true);
    });
    ipcMain.on("button-clearVideoSrc", () => {
        loadVideoSrc(false);
    });

    ipcMain.on("debug-enable", () => {
        mainWindow.webContents.openDevTools();
        mainWindow.setSize(MAIN_WINDOW_WIDTH+300, MAIN_WINDOW_HEIGHT, true);
    });
    ipcMain.on("debug-disable", () => {
        mainWindow.webContents.closeDevTools();
        mainWindow.setSize(MAIN_WINDOW_WIDTH, MAIN_WINDOW_HEIGHT, true);
    });

    // ipcMain.on("button-showElectronStartUrl", () => {
    //     notify("process.env.ELECTRON_START_URL", process.env.ELECTRON_START_URL);
    //     notify("__dirname", __dirname);
    //     authWindow = new BrowserWindow({
    //         width: 600,
    //         height: 620,
    //         resizable: false,
    //         fullscreenable: false,
    //         // frame: false,
    //         // transparent: true,
    //         // backgroundColor: "#00FF00",
    //         // titleBarStyle: "hidden",
    //         // webPreferences: {
    //         //     preload: path.join(__dirname, "preload.js")
    //         // }
    //     });
    //     authWindow.on("closed", () => {
    //         authWindow = null;
    //     });
    //     if (false) { // Decide whether to clear previous sign-in data before loading auth page
    //         authWindow.webContents.session.clearStorageData({}, () => {
    //             authWindow.loadURL("https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.upload&response_type=code&client_id=563425753158-3befv3kd1nceo22iftcscu7oiaohbd6p.apps.googleusercontent.com&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob", {userAgent: "Chrome"});
    //         });
    //     } else {
    //         authWindow.loadURL("https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.upload&response_type=code&client_id=563425753158-3befv3kd1nceo22iftcscu7oiaohbd6p.apps.googleusercontent.com&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob", {userAgent: "Chrome"});
    //     }

    // });

    // ipcMain.on("button-upload", () => {
    //     notify("process.env.ELECTRON_START_URL", process.env.ELECTRON_START_URL);
    // });

    // ipcMain.on("button-test", () => {
    //     mainWindow.show();
    //     mainWindow.webContents.send("removableStorage-event", {
    //         event: "inserted",
    //         storageType: "DVD"
    //     });
    //     setProcessingMessage("Removing old videos from processing directories");
    //     cp.exec("rm -f ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-pre/* ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-pre/.[!.]* ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-post/* ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-post/.[!.]* ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-concat/* ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-concat/.[!.]*", () => {
    //         setProcessingMessage("Copying VOB files from disk to preprocessing directory");
    //         cp.exec("cp ~/Desktop/VIDEO_TS/*_1.VOB ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-pre", () => {
    //             setProcessingMessage("Converting VOB files to MP4 files");
    //             fs.readdir("/Users/Braiden/Library/Application Support/IU Video Uploader/store/video/video-pre", (err, files) => {
    //                 let ffmpegCommand = "";
    //                 files.forEach((fileName) => {
    //                     const i = fileName.substring(4, fileName.length - 6);
    //                     ffmpegCommand += `./ffmpeg -i ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-pre/VTS_${i}_1.VOB -acodec copy -ac 2 -ar 22050 ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/video/video-post/video${Number(i)}.mp4 && `;
    //                 });
    //                 ffmpegCommand = "cd ~/Library/Application\\ Support/IU\\ Video\\ Uploader/store/bin && " + ffmpegCommand.substring(0, ffmpegCommand.length - 4);
    //                 console.log();
    //                 console.log(ffmpegCommand);
    //                 console.log();
    //                 cp.exec(ffmpegCommand, () => {
    //                     setProcessingMessage("Processing completed");
    //                 });
    //             });
    //         });
    //     });
    // });

});