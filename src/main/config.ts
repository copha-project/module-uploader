import { BrowserWindowConstructorOptions,screen, BrowserViewConstructorOptions } from "electron"
import { merge } from 'lodash'
import { appIcon, moduleHubPoint } from '../constants'
import path from 'path'
import { isMac, isWin32 } from "../common"

const baseOptions: BrowserWindowConstructorOptions = {
    center: true,
    height: 600,
    width: 800,
    minWidth: 800,
    minHeight: 600,
    resizable: false,
    show: false,
    maximizable: false,
    fullscreen: false,
    webPreferences: {
      devTools: false,
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
}

function getBaseWindowOptions(){
    const mainDisplay = screen.getPrimaryDisplay()
    // baseOptions.width = baseOptions.width * mainDisplay.scaleFactor
    // baseOptions.height = baseOptions.height * mainDisplay.scaleFactor
    // baseOptions.minHeight = baseOptions.minHeight * mainDisplay.scaleFactor
    // baseOptions.minWidth = baseOptions.minWidth * mainDisplay.scaleFactor
    return baseOptions
}

export function winOptionsBuilder(){
    const winOptions: BrowserWindowConstructorOptions = {
        icon: appIcon,
        // titleBarStyle: 'hidden'
        frame: false,
        transparent: true
    }
    return merge(getBaseWindowOptions(), winOptions)
}

export function macOptionsBuilder(){
    const macOptions: BrowserWindowConstructorOptions = {
        // titleBarStyle: 'hiddenInset',
        frame: false,
        opacity: 0.99,
    }
    return merge(getBaseWindowOptions(), macOptions)
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

export const API = {
    modules : moduleHubPoint + "/api/v1/modules",
    packagePoints : moduleHubPoint + "/package_hosts"
}