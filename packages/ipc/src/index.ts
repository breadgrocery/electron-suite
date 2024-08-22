import { WindowIPC, windowIPC } from "./modules/window";

export interface IPC {
  window: WindowIPC;
}

export const ipc: IPC = {
  window: windowIPC
};
