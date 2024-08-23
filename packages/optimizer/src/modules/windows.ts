import { BrowserWindow } from "electron";

const isWindows = process.platform === "win32";

export interface WindowsOptimizer {
  /**
   * Disables the context menu on the window's title bar.
   */
  disableTitlebarContextMenu: (window: BrowserWindow) => void;
}

export const windowsOptimizer: WindowsOptimizer = {
  disableTitlebarContextMenu: (window: BrowserWindow) => {
    if (isWindows) {
      const WM_INITMENU = 0x0116;
      window.hookWindowMessage(WM_INITMENU, () => {
        window.setEnabled(false);
        window.setEnabled(true);
      });
    }
  }
};
