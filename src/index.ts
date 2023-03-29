import { app, BrowserWindow, ipcMain } from "electron";
import { OpenAiResponseAndMetadata } from "./api/apiCalls";

import todesktop from "@todesktop/runtime";
import {
  createFile,
  getFileContent,
  getRootParentDirectory,
  overwriteFile,
} from "./utils/fileSystem";
todesktop.init();
const path = require("path");

const baseApiUrl = app.isPackaged
  ? "https://code-gen-server.herokuapp.com"
  : "http://localhost:8081";

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export async function createFileFromResponse(
  response: OpenAiResponseAndMetadata
) {
  const { metadata, completedCode } = response;
  const { newFile, projectDirectory, projectFile } = metadata;

  newFile
    ? createFile(projectFile, completedCode, projectDirectory)
    : overwriteFile(projectDirectory, completedCode);
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 1000,
    width: 1200,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: true,
    },
    icon: path.join(__dirname, "assets/logo.ico"),
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  ipcMain.handle("create-or-update-file", (event, response) => {
    createFileFromResponse(response);
  });

  ipcMain.handle("get-file-contents", (event, response) => {
    return getFileContent(response);
  });

  const parentDirectory = getRootParentDirectory(process.cwd());
  console.log(parentDirectory);

  ipcMain.handle("get-directories", (event, response) => {
    // const res = foundDirectory(parentDirectory, response);
    // console.log("main", res);
    return response;
  });

  ipcMain.handle("process", (event, response) => {
    return baseApiUrl;
  });

  !app.isPackaged && mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
