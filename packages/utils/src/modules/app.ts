import { BrowserWindow, Menu, app } from "electron";
import { is } from "./is";

export interface IApplication {
  /**
   * Ensures that only a single instance of the application is running.
   * If another instance is already running, the application will exit.
   */
  ensureSingleton: (window?: BrowserWindow) => void;

  /**
   * Disables the menu bar.
   */
  disableMenuBar: () => void;

  /**
   * Quits when all windows are closed.
   * @param createWindow Callback to create a window if activated from macOS dock.
   */
  quitOnAllWindowsClosed: (createWindow: () => void) => void;
}

export const application: IApplication = {
  ensureSingleton: (window?: BrowserWindow) => {
    if (app.requestSingleInstanceLock()) {
      app.on("second-instance", () => window?.show());
    } else {
      app.quit();
    }
  },
  disableMenuBar: () => {
    Menu.setApplicationMenu(Menu.buildFromTemplate([]));
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
