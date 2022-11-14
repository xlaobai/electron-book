import { app, autoUpdater, BrowserWindow } from "electron";
import { CustomScheme } from "./CustomScheme";
import { CommonWindowEvent } from "./CommonWindowEvent";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
app.on("browser-window-created", (e, win) => {
  console.log("🚀 ~ file: mainEntry.ts ~ line 10 ~ app.on ~ browser-window-created", win)
  CommonWindowEvent.regWinEvent(win);
});
let mainWindow: BrowserWindow;
app.whenReady().then(() => {
  let config = {
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      contextIsolation: false,
      webviewTag: true,
      spellcheck: false,
      disableHtmlFullscreenWindowResize: true,
    },
  };

  mainWindow = new BrowserWindow(config);

  mainWindow.webContents.openDevTools({ mode: "undocked" });
  console.log("openDevTools", process.argv);
  if (process.argv[2]) {
    mainWindow.loadURL(process.argv[2]);
  } else {
    CustomScheme.registerScheme();
    mainWindow.loadURL(`app://index.html`);
    // Updater.check();
  }
  CommonWindowEvent.listen();
  CommonWindowEvent.regWinEvent(mainWindow);
});
