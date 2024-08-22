import { linuxOptimizer, LinuxOptimizer } from "./modules/linux";
import { macOSOptimizer, MacOSOptimizer } from "./modules/macos";
import { windowsOptimizer, WindowsOptimizer } from "./modules/windows";

export interface Optimizer {
  windows: WindowsOptimizer;
  linux: LinuxOptimizer;
  macOS: MacOSOptimizer;
}

export const optimizer: Optimizer = {
  windows: windowsOptimizer,
  linux: linuxOptimizer,
  macOS: macOSOptimizer,
};
