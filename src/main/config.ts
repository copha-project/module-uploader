import { BrowserWindowConstructorOptions } from "electron"
import { appIcon } from '../constants'
import { isMac, isWin32 } from "../common"
const baseOptions: BrowserWindowConstructorOptions = {
    center: true,
    height: 600,
    width: 800,
    minWidth: 600,
    minHeight: 600,
    resizable: false,
    show: false,
    maximizable: false,
    fullscreen: false,
    webPreferences: {
      devTools: false,
      nodeIntegration: false,
      contextIsolation: true
    }
}

export function winOptionsBuilder(){
    const winOptions: BrowserWindowConstructorOptions = {
        icon: appIcon,
        frame: false,
        transparent: true
    }
    return Object.assign(baseOptions, winOptions)
}

export function macOptionsBuilder(){
    const macOptions = {
        titleBarStyle: 'hidden',
        opacity: 0.99,
    }
    return Object.assign(baseOptions, macOptions)
}

export function getOptions(){
    if(isWin32){
        return winOptionsBuilder()
    }
    if(isMac){
        return macOptionsBuilder()
    }
    return baseOptions
}