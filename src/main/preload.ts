import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('app', {
  exit: ()=> ipcRenderer.invoke('cmd',"exit"),
  isWin: ()=> ipcRenderer.invoke('cmd',"isWin"),
  api:{
    openFileSelectorDialog: () => ipcRenderer.invoke('openFileSelectorDialog'),
    getModuleInfo: (filePath:string) => ipcRenderer.invoke('getFileHashData', filePath),
    fetchIdFromToken: (token:string) => ipcRenderer.invoke('fetchIdFromToken', token)
  },
  showError: msg => ipcRenderer.send('showError', msg)
})