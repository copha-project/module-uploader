import { app, contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('app', {
  exit: ()=> ipcRenderer.invoke('cmd',"exit"),
  api:{
    openFileSelectorDialog: () => ipcRenderer.invoke('openFileSelectorDialog'),
    getModuleInfo: (filePath:string) => ipcRenderer.invoke('getFileHashData', filePath)
  }
})