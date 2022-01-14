import { app, BrowserWindow, BrowserWindowConstructorOptions } from "electron"
import path from 'path'
import hotReload from './hot-reload'
import { changeDisplayPosition, changeWebPreferences } from "./windowConfig"
import { isDev } from '../common'
import { merge } from "lodash"

export function addDevOption(options: BrowserWindowConstructorOptions): BrowserWindowConstructorOptions {
    if(isDev){
        options = merge(options, changeDisplayPosition(options))
        options = merge(options, changeWebPreferences(options))
        options.resizable = true
        options.alwaysOnTop = true
    }
    return options
}

export function loadHotReload(){
    if(isDev){
        hotReload(path.join(__dirname,'../../src'),{
          electron: path.join(__dirname, '../../node_modules', '.bin', 'electron')
        })
    }
}

export function openDevTool(){
    if(!isDev) return
    const mainContents = BrowserWindow.getAllWindows()[0].webContents
    if(mainContents.isDevToolsOpened()){
        mainContents.closeDevTools()
        BrowserWindow.getAllWindows()[0].setBounds({width:800})
    }else{
        mainContents.openDevTools()
        BrowserWindow.getAllWindows()[0].setBounds({width:1300})
    }
}