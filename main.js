'use strict';

const {app, BrowserWindow, globalShortcut, ipcMain}  = require('electron');
const configuration = require('./configuration');

let mainWindow = null;
let settingsWindow = null;

app.on('ready', function() {
    if (!configuration.readSettings('shortcutKeys')) {
        configuration.saveSettings('shortcutKeys', ['ctrl', 'shift']);
    }

    mainWindow = new BrowserWindow({
        frame: false,
        height: 740,
        resizable: false,
        width: 368,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    mainWindow.loadFile('./app/index.html');

    setGlobalShortcuts();
});

function setGlobalShortcuts() {
    globalShortcut.unregisterAll();

    var shortcutKeysSetting = configuration.readSettings('shortcutKeys');
    var shortcutPrefix = shortcutKeysSetting.length === 0 ? '' : shortcutKeysSetting.join('+') + '+';

    globalShortcut.register(shortcutPrefix + '1', function () {
        mainWindow.webContents.send('global-shortcut', 0);
    });
    globalShortcut.register(shortcutPrefix + '2', function () {
        mainWindow.webContents.send('global-shortcut', 1);
    });
}

ipcMain.on('close-main-window', function () {
    app.quit();
});

ipcMain.on('open-settings-window', function () {
    console.log("get open sett")
    if (settingsWindow) {
        return;
    }

    settingsWindow = new BrowserWindow({
        frame: false,
        height: 200,
        resizable: false,
        width: 200,
        webPreferences: {
            nodeIntegration: true
        }
    });

    settingsWindow.loadFile('./app/settings.html');

    settingsWindow.on('closed', function () {
        settingsWindow = null;
    });
});

ipcMain.on('close-settings-window', function () {
    if (settingsWindow) {
        settingsWindow.close();
    }
});

ipcMain.on('set-global-shortcuts', function () {
    setGlobalShortcuts();
});