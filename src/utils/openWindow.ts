import { BrowserWindow } from "electron";

export interface OpenWindowOptions {
  url: string;
  width: number;
  height: number;
  title?: string;
}

export function openWindow(options: OpenWindowOptions): void {
  const { url, width, height, title } = options;

  // Create a new browser window
  const win = new BrowserWindow({
    width: width,
    height: height,
    title: title,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the specified URL
  win.loadURL(url);

  // Show the window when it's ready
  win.once("ready-to-show", () => {
    win.show();
  });
}
