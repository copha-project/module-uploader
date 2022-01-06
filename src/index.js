const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')

let mainWin = null
function createWindow() {
    mainWin = new BrowserWindow({
        center: true,
        width: 800,
        height: 600,
        // frame: false,
        webPreferences: {
            devTools: true
        }
    })
    mainWin.loadFile('render/index.html')
}

function openDev(){
    mainWin.webContents.openDevTools()
}

function reload(){
    mainWin.webContents.reload()
}

app.whenReady().then(() => {
    createWindow()
    globalShortcut.register('CommandOrControl+D', openDev)
    globalShortcut.register('CommandOrControl+R', reload)
})