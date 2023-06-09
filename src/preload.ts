// See the Electron documentation for details on how to use preload scripts:

import { OpenAiResponseAndMetadata } from "./api";
import { CreatePullRequestOptions } from "./utils/gitCommands";
import { OpenWindowOptions } from "./utils/openWindow";

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // Send Methods
  testSend: (args: any) => ipcRenderer.send("test-send", args),
  // Receive Methods
  getEnvVariables: async () => await ipcRenderer.invoke("process"),

  createOrUpdateFile: (response: OpenAiResponseAndMetadata) =>
    ipcRenderer.invoke("create-or-update-file", response),

  getFile: (response: string) =>
    ipcRenderer.invoke("get-file-contents", response),

  getAndParseDirectories: async (response: string) =>
    await ipcRenderer.invoke("get-directories", response),

  selectFolder: () => ipcRenderer.invoke("dialog:openDirectory"),
  reload: () => ipcRenderer.invoke("reload"),

  updateChangedFile: (filePath: string) => {
    return ipcRenderer.invoke("update-changed-file", filePath);
  },

  createPr: (options: CreatePullRequestOptions) => {
    return ipcRenderer.invoke("create-pr", options);
  },

  openWindow: (options: OpenWindowOptions) => {
    return ipcRenderer.invoke("open-window", options);
  },
});
