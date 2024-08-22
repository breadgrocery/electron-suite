import { BrowserWindow, nativeTheme, shell } from "electron";
import windowStateKeeper, { Options } from "electron-window-state";

export interface Window {
  /**
   * Persist and restore the window state across application sessions.
   */
  persistWindowState: (window: BrowserWindow, options?: Options) => void;

  /**
   * Opens `_blank` target links in an external browser.
   */
  useExternalBrowser: (window: BrowserWindow) => void;

  /**
   * Adjusts background color based on the current color scheme (light or dark).
   *
   * @param lightColor The background color to use in light mode.
   * @param darkColor The background color to use in dark mode.
   */
  adaptBackgroundColorScheme: (
    window: BrowserWindow,
    lightColor?: string,
    darkColor?: string
  ) => void;
}

export const window: Window = {
  persistWindowState: (window: BrowserWindow, options?: Options) => {
    // Restore window size
    const windowState = windowStateKeeper(options || {});
    const bounds = window.getBounds();
    window.setBounds({
      width: windowState.width || bounds.width,
      height: windowState.height || bounds.height,
      x: windowState.x || bounds.x,
      y: windowState.y || bounds.y,
    });

    // Register listeners
    windowState.manage(window);
  },
  useExternalBrowser: (window: BrowserWindow) => {
    window.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url);
      return { action: "deny" };
    });
  },
  adaptBackgroundColorScheme: (
    window: BrowserWindow,
    lightColor?: string,
    darkColor?: string
  ) => {
    const updatebackgroundColor = () => {
      const light = lightColor || "#FFFFFF";
      const dark = darkColor || "#000000";
      const backgroundColor = nativeTheme.shouldUseDarkColors ? dark : light;
      window.setBackgroundColor(backgroundColor);
    };
    updatebackgroundColor();
    nativeTheme.on("updated", updatebackgroundColor);
  },
};
