import AutoLaunch from "auto-launch";
import { BrowserWindow, Menu, app } from "electron";
import { is } from "./is";

export interface IApplication {
  /**
   * Disable the menu bar.
   */
  disableMenuBar: () => void;

  /**
   * Ensure that only a single instance of the application is running.
   * If another instance is already running, the application will exit.
   *
   * @param window The window to show when a second instance is detected.
   */
  ensureSingleton: (window?: BrowserWindow) => void;

  /**
   * Quit when all windows are closed.
   *
   * @param createWindow Callback to create a window if activated from macOS dock.
   */
  quitOnAllWindowsClosed: (createWindow: () => void) => void;

  /**
   * Configure the application's auto-launch behavior.
   *
   * @param enable Whether to enable or disable auto-launch.
   */
  setAutoLaunch: (enable: boolean) => void;
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
  },
  setAutoLaunch: (enable: boolean) => {
    const launcher = new AutoLaunch({ name: app.name });
    launcher.isEnabled().then(isEnabled => {
      if (enable === isEnabled) return;
      if (enable) {
        launcher.enable();
      } else {
        launcher.disable();
      }
    });
  }
};
