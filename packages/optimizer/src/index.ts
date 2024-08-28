import { LinuxOptimizer, linuxOptimizer } from "./modules/linux";
import { MacOSOptimizer, macOSOptimizer } from "./modules/macos";
import { MiscOptimizer, miscOptimizer } from "./modules/misc";
import { WindowsOptimizer, windowsOptimizer } from "./modules/windows";

export interface Optimizer {
  misc: MiscOptimizer;
  windows: WindowsOptimizer;
  linux: LinuxOptimizer;
  macOS: MacOSOptimizer;
}

export const optimizer: Optimizer = {
  misc: miscOptimizer,
  windows: windowsOptimizer,
  linux: linuxOptimizer,
  macOS: macOSOptimizer
};
