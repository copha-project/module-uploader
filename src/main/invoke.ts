import { ipcMain, dialog, IpcMainInvokeEvent, IpcMainEvent } from 'electron'
import Utils from 'uni-utils'
import App from './app'

const CommandList: any = {
    exit: () => App.getInstance().quit()
}
export default class Invoke {
    constructor(){
        ipcMain.handle('openFileSelectorDialog', this.openFileSelectorDialog)
        ipcMain.handle('getFileHashData',this.getFileHashData)
        ipcMain.on('showError',this.showError)
        ipcMain.handle('cmd', this.cmd)
    }
    async openFileSelectorDialog(event:IpcMainInvokeEvent, ...args:any[]){
        const res = dialog.showOpenDialogSync(
            {
                properties: ['openFile', 'openDirectory'],
            })
        if (res && res.length>0) {
            // event.sender.send('selected-file', res.filePaths[0])
            // event.reply('selected-file', res[0])
            return res[0]
        }
    }
    async getFileHashData(event:IpcMainInvokeEvent, filePath:string ,...args:any[]){
        if(!filePath || !await Utils.checkFile(filePath)) return
        
        return {
            sha1: await Utils.hash.getFileHash(filePath,'sha1'),
            md5: await Utils.hash.getFileMd5(filePath)
        }
    }
    async showError(event:IpcMainEvent, ...args:any[]) {
        dialog.showMessageBox(App.getInstance().mainWindow,{
            type: 'error',
            message: args[0]||'unknow error'
        })
    }
    cmd(event:IpcMainInvokeEvent, command:string ,...args:any[]){
        console.log('get command:', command);
        if(command in CommandList){
            return CommandList[command]()
        }
    }
}