import { contextBridge, ipcRenderer } from 'electron'
import { moduleHubPoint } from '../constants'

contextBridge.exposeInMainWorld('app', {
  exit: ()=> ipcRenderer.invoke('cmd',"exit"),
  isWin: ()=> ipcRenderer.invoke('cmd',"isWin"),
  isPackaged: ()=> ipcRenderer.invoke('cmd', "isPackaged"),
  validateVersion: (ver:string)=> ipcRenderer.invoke('validateVersion',ver),
  api:{
    HOST: moduleHubPoint,
    openFileSelectorDialog: () => ipcRenderer.invoke('openFileSelectorDialog'),
    getModuleInfo: (filePath:string) => ipcRenderer.invoke('getFileHashData', filePath),
    fetchIdFromToken: (token:string) => ipcRenderer.invoke('fetchIdFromToken', token),
    uploadPackage: (...args: string[])=> ipcRenderer.invoke('uploadPackage', ...args)
  },
  showError: (msg:string) => ipcRenderer.send('showError', msg),
  showMsg: (msg:string) => ipcRenderer.send('showMsg', msg),
  openDevTools: ()=> ipcRenderer.invoke('cmd', "openDevTools"),
  checkUpdate: ()=> ipcRenderer.invoke('cmd', "checkUpdate")
})