import { Path, PathValue } from "dot-path-value";
import { app, ipcMain, ipcRenderer } from "electron";
import ElectronStore from "electron-store";
import { whenAppIsReady } from "./hooks";

export type Serializable = Record<string, unknown>;

export type Store<T extends Serializable> = ElectronStore<T>;

interface Options<T extends Serializable> {
  /**
   * Unique identifier for the IPC channel
   */
  id: string;
  /**
   * Filename (defaults to id if not specified)
   */
  name?: string;
  /**
   * File path where data is stored
   */
  path?: string;
  /**
   * Default values
   */
  defaults: T;
}

const channel = (method: string, id: string) => `store-${method}:${id}`;

export const createStore = <T extends Serializable>(options: Options<T>) => {
  const { id, name = id, path = app.getPath("userData"), defaults } = options;
  const store = new ElectronStore<T>({
    name: name,
    cwd: path,
    fileExtension: "json",
    serialize: value => JSON.stringify(value, null, "  "),
    deserialize: JSON.parse,
    accessPropertiesByDotNotation: true,
    defaults: defaults
  });

  // Register ipcMain listeners
  whenAppIsReady(() => {
    ipcMain.on(channel("clear", id), () => store.clear());
    ipcMain.on(channel("delete", id), (_, key) => store.delete(key));
    ipcMain.handle(channel("get", id), (_, key) => store.get(key));
    ipcMain.handle(channel("has", id), (_, key) => store.has(key));
    ipcMain.on(channel("reset", id), () => store.reset());
    ipcMain.on(channel("set", id), (_, key, value) => store.set(key, value));
  });

  return {
    store: {
      main: store,
      renderer: {
        clear: () => {
          ipcRenderer.send(channel("clear", id));
        },
        delete: (key: Path<T>) => {
          ipcRenderer.send(channel("delete", id), key);
        },
        get: <P extends Path<T>>(key: Path<T>): Promise<PathValue<T, P>> => {
          return ipcRenderer.invoke(channel("get", id), key);
        },
        has: (key: Path<T>): Promise<boolean> => {
          return ipcRenderer.invoke(channel("has", id), key);
        },
        reset: () => {
          ipcRenderer.send(channel("reset", id));
        },
        set: <P extends Path<T>>(key: Path<T>, value: PathValue<T, P>) => {
          ipcRenderer.send(channel("set", id), key, value);
        }
      }
    }
  };
};
