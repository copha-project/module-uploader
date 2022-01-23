import { BrowserWindow, BrowserWindowConstructorOptions } from "electron"
import path from 'path'
import os from 'os'
import hotReload from './hot-reload'
import { changeDisplayPosition, changeWebPreferences } from "./windowConfig"
import { merge } from "lodash"

export const isWin32 = os.platform() === 'win32'

export function getDevOption(): BrowserWindowConstructorOptions {
    let options = merge({}, changeDisplayPosition())
    options = merge(options, changeWebPreferences())
    if(!isWin32){
        options.resizable = true
    }
    options.alwaysOnTop = true
    return options
}

export function loadHotReload(){
    hotReload(path.join(__dirname,'../../src'),{
        electron: path.join(__dirname, '../../node_modules', '.bin', 'electron')
    })
}

export function openDevTool(){
    const mainContents = BrowserWindow.getAllWindows()[0].webContents
    if(mainContents.isDevToolsOpened()){
        mainContents.closeDevTools()
        BrowserWindow.getAllWindows()[0].setBounds({width:800})
    }else{
        mainContents.openDevTools()
        BrowserWindow.getAllWindows()[0].setBounds({width:1300})
    }
}