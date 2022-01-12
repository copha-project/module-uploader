import { app, BrowserWindow }  from 'electron'
import { loadHotReload} from '../dev'
import { isMac } from '../common'
import App from './app'
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit()
}

console.log(`electron app running at ${process.env.NODE_ENV || "producting"} mode.`)

loadHotReload()

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', App.getInstance)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    App.getInstance()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
