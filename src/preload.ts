// See the Electron documentation for details on how to use preload scripts:

import { OpenAiResponseAndMetadata } from "./api/apiCalls";

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Invoke Methods
    testInvoke: (args: any) => ipcRenderer.invoke('test-invoke', args),
    // Send Methods
    testSend: (args: any) => ipcRenderer.send('test-send', args),
    // Receive Methods
    testReceive: (callback: any) => ipcRenderer.on('test-receive', (event, data) => { callback(data) }),

    createOrUpdateFile: (response: OpenAiResponseAndMetadata) => ipcRenderer.invoke('create-or-update-file', response),
});