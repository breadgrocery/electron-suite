import { Event, app } from "electron";
import path from "node:path";
import { is } from "./is";

export interface IScheme {
  /**
   * Registers a custom protocol handler for the application.
   *
   * @param protocol The custom protocol name that the application will handle.
   *
   * @param handler A callback function that is invoked when the application is launched via the protocol.
   */
  registerSchemeHandler: (protocol: string, handler: (event: Event, url: string) => void) => void;
}

export const scheme: IScheme = {
  registerSchemeHandler: (protocol: string, handler: (event: Event, url: string) => void): void => {
    // Register application to handle the custom protocol
    if (process.defaultApp) {
      if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient(protocol, process.execPath, [path.resolve(process.argv[1])]);
      }
    } else {
      app.setAsDefaultProtocolClient(protocol);
    }

    // Register handler
    if (is.platform.macOS) {
      app.on("open-url", handler);
    } else {
      if (app.hasSingleInstanceLock()) {
        app.on("second-instance", (event, argv) => {
          const url = argv.pop()?.slice(0, -1) || `${protocol}://`;
          handler(event, url);
        });
      }
    }
  }
};
