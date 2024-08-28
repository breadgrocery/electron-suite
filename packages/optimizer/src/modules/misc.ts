export interface MiscOptimizer {
  /**
   * Disables the security warnings
   */
  disableSecurityWarnings: () => void;
}

export const miscOptimizer: MiscOptimizer = {
  disableSecurityWarnings: () => {
    process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
  }
};
