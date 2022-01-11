import { BrowserWindowConstructorOptions } from "electron"
import path from 'path'
import hotReload from './hot-reload'
import { changeDisplayPosition, changeWebPreferences } from "./windowConfig"
import { isDev } from '../common'

export function addDevOption(options: BrowserWindowConstructorOptions): BrowserWindowConstructorOptions {
    if(isDev){
        options = Object.assign(options, changeDisplayPosition())
        options = Object.assign(options, changeWebPreferences())
        options.resizable = true
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