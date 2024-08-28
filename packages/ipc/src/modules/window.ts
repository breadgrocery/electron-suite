import { BrowserWindow, ipcMain } from "electron";

export interface WindowIPC {
  registerWindowIPCHandlers: (window: BrowserWindow) => void;
  registerWindowEventHandlers: (window: BrowserWindow) => void;
}

export const windowIPC: WindowIPC = {
  registerWindowIPCHandlers: (window: BrowserWindow) => {
    ipcMain.on("window-set-always-on-top", (_, value: boolean) => window.setAlwaysOnTop(value));
    ipcMain.on("window-minimize", () => window.minimize());
    ipcMain.on("window-maximize", () => window.maximize());
    ipcMain.on("window-unmaximize", () => window.unmaximize());
    ipcMain.on("window-close", () => window.close());
    ipcMain.handle("window-is-always-on-top", () => window.isAlwaysOnTop());
    ipcMain.handle("window-is-maximized", () => window.isMaximized());
  },
  registerWindowEventHandlers: (window: BrowserWindow) => {
    window.on("always-on-top-changed", (_, isAlwaysOnTop) =>
      window.webContents.send("window-always-on-top-changed", isAlwaysOnTop)
    );
    window.on("minimize", () => window.webContents.send("window-minimize"));
    window.on("restore", () => window.webContents.send("window-restore"));
    window.on("maximize", () => window.webContents.send("window-maximize"));
    window.on("unmaximize", () => window.webContents.send("window-unmaximize"));
    window.on("close", () => window.webContents.send("window-close"));
  }
};
