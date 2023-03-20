import { app, BrowserWindow, ipcMain } from 'electron';
import { simpleGit, SimpleGit, CleanOptions, SimpleGitOptions } from 'simple-git';
import { CodeCompletionResponseType, OpenAiResponseAndMetadata } from './api/apiCalls';

const fs = require('fs')
const path = require('path')

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

export function createFile(fileName: string, text: string, folder: string = './src') {
  const location = path.join(folder, fileName);
  fs.writeFile(location, text, (err: any) => {
      if (err) throw err;
      console.log(`${location} has been created and populated with text.`);
  });
}

export async function overwriteFile(filePath: string, code: string) {
  await fs.writeFile(filePath, code, (err: any) => err && console.log(err));
}

export async function createFileFromResponse(response: OpenAiResponseAndMetadata) {

  const { openAiResponse, metadata } = response
  const {type, projectDirectory, projectFile} = metadata

  if (type === CodeCompletionResponseType.newFile) {
      const content = openAiResponse.choices[0].message?.content ? openAiResponse.choices[0].message?.content : ""

      if (content.includes("```")) {
          const splitOnQuotes = content.split("```")
          createFile(projectFile, splitOnQuotes[1], projectDirectory)
      } else {
          createFile(projectFile, content, projectDirectory)
      }

  }
  
  if (type === CodeCompletionResponseType.updateFile) {
      const content = openAiResponse.choices[0].message?.content ? openAiResponse.choices[0].message?.content : ""
      if (content) {
        if (content.includes("```")) {
          const splitOnQuotes = content.split("```")
          overwriteFile(projectDirectory + "/" + projectFile, splitOnQuotes[1])
      } else {
        overwriteFile(projectDirectory + "/" + projectFile, content)
      }
      }
  }
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 1000,
    width: 1200,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: true
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  ipcMain.handle('create-or-update-file', (event, response) => {
    createFileFromResponse(response)
  })

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
