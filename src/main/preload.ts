import { app, contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('app', {
  api:{
    openFileSelectorDialog: () => ipcRenderer.invoke('openFileSelectorDialog'),
    getModuleInfo: (filePath:string) => ipcRenderer.invoke('getFileHashData', filePath)
  }
})