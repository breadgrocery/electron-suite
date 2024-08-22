import { LinuxOptimizer, linuxOptimizer } from "./modules/linux";
import { MacOSOptimizer, macOSOptimizer } from "./modules/macos";
import { WindowsOptimizer, windowsOptimizer } from "./modules/windows";

export interface Optimizer {
  windows: WindowsOptimizer;
  linux: LinuxOptimizer;
  macOS: MacOSOptimizer;
}

export const optimizer: Optimizer = {
  windows: windowsOptimizer,
  linux: linuxOptimizer,
  macOS: macOSOptimizer
};
