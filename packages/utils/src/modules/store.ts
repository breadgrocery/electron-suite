import { app, ipcMain, ipcRenderer } from "electron";
import ElectronStore from "electron-store";
import { Path, PathValue } from "../types/path";
import { whenAppIsReady } from "./hooks";

export type Serializable = Record<string, unknown>;

export type Store<T extends Serializable> = ElectronStore<T>;

interface Options<T extends Serializable> {
  id: string;
  path?: string;
  defaults: T;
}

const channel = (id: string) => `store-set-value:${id}`;

export const createStore = <T extends Serializable>(options: Options<T>): Store<T> => {
  const { id, path = app.getPath("userData"), defaults } = options;
  const store = new ElectronStore<T>({
    name: id,
    cwd: path,
    fileExtension: "json",
    serialize: value => JSON.stringify(value, null, "  "),
    deserialize: JSON.parse,
    accessPropertiesByDotNotation: true,
    defaults: defaults
  });

  // Register ipcMain listener
  whenAppIsReady(() => ipcMain.on(channel(id), (_, key, value) => store.set(key, value)));

  return store as Store<T>;
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

export const storeRenderer = {
  set: <T>(id: string, key: Path<T>, value: PathValue<T, Path<T>>): void => {
    ipcRenderer.send(channel(id), key, value);
  }
};
