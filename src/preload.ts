// See the Electron documentation for details on how to use preload scripts:

import { OpenAiResponseAndMetadata } from "./api/apiCalls";

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Send Methods
    testSend: (args: any) => ipcRenderer.send('test-send', args),
    // Receive Methods
    getBaseApiUrl: async () => await ipcRenderer.invoke('process'),

    createOrUpdateFile: (response: OpenAiResponseAndMetadata) => ipcRenderer.invoke('create-or-update-file', response),

});
