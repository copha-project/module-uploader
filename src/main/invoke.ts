import { ipcMain, dialog, IpcMainInvokeEvent } from 'electron'
import Utils from 'uni-utils'

export default class Invoke {
    constructor(){
        ipcMain.handle('openFileSelectorDialog', this.openFileSelectorDialog)
        ipcMain.handle('getFileHashData',this.getFileHashData)
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
}