import { app } from "electron";

export interface Env {
  version: {
    electron: string;
    chrome: string;
    node: string;
    app: string;
  };
}

export const env: Env = {
  version: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.version,
    app: app.getVersion()
  }
};
