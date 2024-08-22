import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge } from "electron";

/**
 * Use `contextBridge` APIs to expose Electron APIs to renderer
 * only if context isolation is enabled, otherwise
 * just add to the DOM global.
 */
if (process.contextIsolated) {
  contextBridge.exposeInMainWorld("electron", electronAPI);
} else {
  // @ts-expect-error (define in dts)
  window.electron = electronAPI;
}
