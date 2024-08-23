import { BrowserWindow, Tray, app } from "electron";

export interface IHooks {
  createWindow: () => BrowserWindow;
  onWindowWillCreate?: () => void;
  onWindowCreated?: (window: BrowserWindow) => void;

  createTray?: (window: BrowserWindow) => Tray;
  onTrayWillCreate?: () => void;
  onTrayCreated?: (tray?: Tray, window?: BrowserWindow) => void;
}

export const createApp = (hooks: IHooks) => {
  const action = () => {
    hooks.onWindowWillCreate && hooks.onWindowWillCreate();
    const window = hooks.createWindow();
    hooks.onWindowCreated && hooks.onWindowCreated(window);

    if (hooks.createTray) {
      hooks.onTrayWillCreate && hooks.onTrayWillCreate();
      const tray = hooks.createTray(window);
      hooks.onTrayCreated && hooks.onTrayCreated(tray);
    }
  };

  if (app.isReady()) {
    action();
  } else {
    app.on("ready", action);
  }
};
