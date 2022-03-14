import { isWin32, isUUID, fetch } from '../common'
import { ipcMain, dialog, IpcMainInvokeEvent, IpcMainEvent, app } from 'electron'
import Utils from 'uni-utils'
import FormData from 'form-data'
import fs from 'fs'
import compareVersions from 'compare-versions';
import App from './app'
import { showErrorMessage, showInfoMessage } from './message'

const CommandList: any = {
    exit: () => App.getInstance().quit(),
    openDevTools: ()=> App.getInstance().openDevTools(),
    isWin: ()=> isWin32,
    isPackaged: ()=> app.isPackaged,
    isUUID
}
export default class Invoke {
    constructor(){
        ipcMain.handle('openFileSelectorDialog', this.openFileSelectorDialog)
        ipcMain.handle('getFileHashData',this.getFileHashData)
        ipcMain.handle('fetchIdFromToken', this.fetchIdFromToken)
        ipcMain.handle('validateVersion', this.validateVersion)
        ipcMain.handle('uploadPackage', this.uploadPackage)
        ipcMain.on('showError',this.showError)
        ipcMain.on('showMsg',this.showMsg)
        ipcMain.handle('cmd', this.cmd)
    }
    async openFileSelectorDialog(event:IpcMainInvokeEvent, ...args:any[]){
        const res = dialog.showOpenDialogSync(
            {
                // properties: ['openFile', 'openDirectory'],
                properties: ['openFile'],
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
        return showErrorMessage(args[0], 'an error occurs')
    }
    async showMsg(event: IpcMainEvent, ...args:string[]){
        return showInfoMessage(args[0], "")
    }
    async fetchIdFromToken(event:IpcMainEvent, token:string){
        const idToken = token.split(":")
        if(idToken.length !== 2) return ''
        const id = Buffer.from(idToken[0],'hex').toString()
        if(!isUUID(id)) return ''
        return id
    }
    validateVersion(event:IpcMainEvent, s:string){
        return compareVersions.validate(s)
    }
    async uploadPackage(event:IpcMainEvent, token:string, filePath:string, uploadPoint: string , version:string){
        const res = {code:1,msg:''}
        try {
            // const uploadPoint = "http://127.0.0.1:3456/upload"
            // console.log(token,filePath,version,uploadPoint);
            const body = new FormData()
            body.append('package', fs.readFileSync(filePath), "package.zip")
            body.append('version', version)
            body.append('authorization', token)

            await fetch(uploadPoint, body, {
                method: "POST"
            })
            res.code = 0

        } catch (error) {
            console.log('uploadPackage: ',uploadPoint,error)
            
            res.msg = error?.message || "unknown error"
        }
        return res
    }
    cmd(event:IpcMainInvokeEvent, command:string ,...args:any[]){
        console.log('get command:', command);
        if(command in CommandList){
            return CommandList[command](args)
        }
        return 'no cmd'
    }
}