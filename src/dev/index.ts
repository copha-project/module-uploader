import { BrowserWindowConstructorOptions } from "electron"
import path from 'path'
import hotReload from './hot-reload'
import { changeDisplayPosition } from "./position"
import { isDev } from '../common'

export async function addDevOption(options: BrowserWindowConstructorOptions): Promise<BrowserWindowConstructorOptions> {
    options = Object.assign(options, changeDisplayPosition())
    return options
}

export function loadHotReload(){
    if(isDev){
        hotReload(path.join(__dirname,'../../src'),{
          electron: path.join(__dirname, '../../node_modules', '.bin', 'electron')
        })
    }
}