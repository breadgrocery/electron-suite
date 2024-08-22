import { BrowserWindow } from "electron";

export interface WindowsOptimizer {
  /**
   * Disables the context menu on the window's title bar.
   */
  disableTitlebarContextMenu: (window: BrowserWindow) => void;
}

export const windowsOptimizer: WindowsOptimizer = {
  disableTitlebarContextMenu: (window: BrowserWindow) => {
    const WM_INITMENU = 0x0116;
    window.hookWindowMessage(WM_INITMENU, () => {
      window.setEnabled(false);
      window.setEnabled(true);
    });
  }
};
