import { join } from "path";
import { optimizer } from "@electron-suite/optimizer";
import { application, env, is, window } from "@electron-suite/utils";
import { app, BrowserWindow } from "electron";

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "./preload.js"),
      webSecurity: false,
      sandbox: false
    }
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  // Load the index.html of the app.
  mainWindow.loadFile(join(__dirname, "../index.html"));

  return mainWindow;
};

app.on("ready", () => {
  const mainWindow = createWindow();

  // Utils is
  console.log(`isWindows: ${is.platform.windows}`);
  console.log(`isLinux: ${is.platform.linux}`);
  console.log(`isMacOS: ${is.platform.macOS}`);

  // Utils env
  console.log(`Electron version: ${env.version.electron}`);
  console.log(`Chrome version: ${env.version.chrome}`);
  console.log(`Node version: ${env.version.node}`);
  console.log(`App version: ${env.version.app}`);

  // Utils application
  application.ensureSingleton(mainWindow);
  application.disableMenuBar();
  application.quitOnAllWindowsClosed(createWindow);

  // Utils window
  window.persistWindowState(mainWindow);
  window.useExternalBrowser(mainWindow);
  window.adaptBackgroundColorScheme(mainWindow, "#9FEAF9", "#1B1C26");

  // Optimizations
  optimizer.windows.disableTitlebarContextMenu(mainWindow);
});
