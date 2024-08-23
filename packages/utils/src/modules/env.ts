import { app } from "electron";

export interface IEnv {
  version: {
    electron: string;
    chrome: string;
    node: string;
    app: string;
  };
}

export const env: IEnv = {
  version: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.version,
    app: app.getVersion()
  }
};
