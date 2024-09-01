import { optimizer } from "@electron-suite/optimizer";
import { application, createApp, env, i18nInit, is, menu, t, window } from "@electron-suite/utils";
import {
  BrowserWindow,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
  Tray,
  app,
  shell
} from "electron";
import { join } from "path";
import { demoStore } from "./store/demo";

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
      sandbox: false,
      devTools: true
    }
  });

  mainWindow.on("ready-to-show", () => mainWindow.show());

  // Load the index.html of the app.
  mainWindow.loadFile(join(__dirname, "../index.html"));

  return mainWindow;
};

const createTray = (window: BrowserWindow) => {
  const tray = new Tray(join(__dirname, "../assets/icon.png"));
  tray.setToolTip("Playground for Electron Suite");
  const contextMenu: Array<MenuItemConstructorOptions | MenuItem> = [
    {
      label: "Dashboard",
      click: () => window.show()
    },
    { type: "separator" },
    {
      label: "Dirs",
      submenu: [
        {
          label: "UserData dir",
          click: () => shell.openPath(app.getPath("userData"))
        },
        {
          label: "AppData dir",
          click: () => shell.openPath(app.getPath("appData"))
        }
      ]
    },
    { type: "separator" },
    {
      label: "Exit",
      click: () => app.quit()
    }
  ];

  // Localize context menu
  const localized = menu.localize(Menu.buildFromTemplate(contextMenu), label => t(label));

  tray.setContextMenu(localized);
  return tray;
};

createApp({
  createWindow,
  onWindowWillCreate: () => {
    // Utils is
    console.log(`isWindows: ${is.platform.windows}`);
    console.log(`isLinux: ${is.platform.linux}`);
    console.log(`isMacOS: ${is.platform.macOS}`);

    // Utils env
    console.log(`Electron version: ${env.version.electron}`);
    console.log(`Chrome version: ${env.version.chrome}`);
    console.log(`Node version: ${env.version.node}`);
    console.log(`App version: ${env.version.app}`);

    // I18n initialization
    i18nInit(
      {
        en: {
          "Dashboard": "Dashboard",
          "Dirs": "Dirs",
          "UserData dir": "UserData dir",
          "AppData dir": "AppData dir",
          "Exit": "Exit"
        },
        zh: {
          "Dashboard": "主面板",
          "Dirs": "打开目录",
          "UserData dir": "用户数据目录",
          "AppData dir": "应用数据目录",
          "Exit": "退出"
        }
      },
      "zh"
    );

    demoStore.main.set("enable", false);
  },
  onWindowCreated: (mainWindow: BrowserWindow) => {
    // Utils application
    application.ensureSingleton(mainWindow);
    application.disableMenuBar();
    application.quitOnAllWindowsClosed(createWindow);

    // Utils window
    window.persistWindowState(mainWindow);
    window.useExternalBrowser(mainWindow);
    window.adaptBackgroundColorScheme(mainWindow, "#9FEAF9", "#1B1C26");
    window.closeToHide(mainWindow);

    // Optimizations
    optimizer.misc.disableSecurityWarnings();
    optimizer.windows.disableTitlebarContextMenu(mainWindow);

    // Open devTools
    mainWindow.webContents.openDevTools();
  },
  createTray
});
