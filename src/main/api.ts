import { ipcMain, dialog } from 'electron'
import Utils from 'uni-utils'

ipcMain.on('open-file-dialog',async (event,...args) => {
    const res = await dialog.showOpenDialog(
        {
            properties: ['openFile', 'openDirectory']
        })
    console.log(res);
    
    if (!res.canceled && res.filePaths.length>0) {
        // event.sender.send('selected-file', res.filePaths[0])
        event.reply('selected-file', res.filePaths[0])
    }
})

ipcMain.handle('check-file', async (event,...args)=>{
    console.log(args,123);
    return Utils.hash.getFileSha256(args[0])
})