import { BrowserWindow, Menu, app } from "electron";
import { is } from "./is";

export interface IApplication {
  /**
   * Disables the menu bar.
   */
  disableMenuBar: () => void;

  /**
   * Ensures that only a single instance of the application is running.
   * If another instance is already running, the application will exit.
   */
  ensureSingleton: (window?: BrowserWindow) => void;

  /**
   * Quits when all windows are closed.
   * @param createWindow Callback to create a window if activated from macOS dock.
   */
  quitOnAllWindowsClosed: (createWindow: () => void) => void;
}

export const application: IApplication = {
  disableMenuBar: () => {
    Menu.setApplicationMenu(Menu.buildFromTemplate([]));
  },
  ensureSingleton: (window?: BrowserWindow) => {
    if (app.requestSingleInstanceLock()) {
      app.on("second-instance", () => window?.show());
      app.on("quit", () => app.releaseSingleInstanceLock());
    } else {
      app.quit();
    }
  },
  quitOnAllWindowsClosed: (createWindow: () => void) => {
    if (is.platform.macOS) {
      app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow();
        }
      });
    } else {
      app.on("window-all-closed", () => {
        app.quit();
      });
    }
  }
};
