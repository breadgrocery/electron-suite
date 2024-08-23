import { app } from "electron";

export interface IIs {
  env: {
    dev: boolean;
  };
  platform: {
    windows: boolean;
    linux: boolean;
    macOS: boolean;
  };
}

export const is: IIs = {
  env: {
    dev: !app.isPackaged
  },
  platform: {
    windows: process.platform === "win32",
    linux: process.platform === "linux",
    macOS: process.platform === "darwin"
  }
};
