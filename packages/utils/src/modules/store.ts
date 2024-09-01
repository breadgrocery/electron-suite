import { app, ipcMain } from "electron";
import ElectronStore from "electron-store";
import merge from "lodash.merge";
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
  /**
   * Register ipcMain listeners (defaults to false)
   */
  ipcListeners?: boolean;
}

const channel = (method: string, id: string) => `store-${method}:${id}`;

export const createStore = <T extends Serializable>(options: Options<T>): Store<T> => {
  const { id, name = id, path = app.getPath("userData"), defaults, ipcListeners = true } = options;
  const store = new ElectronStore<T>({
    name: name,
    cwd: path,
    fileExtension: "json",
    serialize: value => JSON.stringify(value, null, "  "),
    deserialize: JSON.parse,
    accessPropertiesByDotNotation: true,
    defaults: defaults
  });

  // New items' default value deep migration
  const data = store.store;
  store.clear();
  store.set(merge(store.store, data));

  // Register ipcMain listeners
  if (ipcListeners) {
    whenAppIsReady(() => {
      ipcMain.on(channel("clear", id), () => store.clear());
      ipcMain.on(channel("delete", id), (_, key) => store.delete(key));
      ipcMain.handle(channel("get", id), (_, key) => store.get(key));
      ipcMain.handle(channel("has", id), (_, key) => store.has(key));
      ipcMain.on(channel("reset", id), () => store.reset());
      ipcMain.on(channel("set", id), (_, key, value) => store.set(key, value));
      ipcMain.on(channel("patch", id), (_, value) => store.set(value));
    });
  }

  return store;
};

export const createReactiveStore = <T extends Serializable>(options: Options<T>): T => {
  // Create the proxied store
  const store = createStore(options);

  const proxyHandler: ProxyHandler<T> = {
    set(target, property, value) {
      target[property as keyof T] = value;
      store.set(property as keyof T, value);
      return true;
    },
    get(target, property) {
      const result = target[property as keyof T];
      if (result && typeof result === "object") {
        return new Proxy(result, proxyHandler as ProxyHandler<typeof result>);
      }
      return result;
    }
  };

  return new Proxy(store.store, proxyHandler);
};
