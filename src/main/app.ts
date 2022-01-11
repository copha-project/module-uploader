import { BrowserWindowConstructorOptions, BrowserWindow, globalShortcut } from "electron"
import { addDevOption } from "../dev"
import { getOptions } from "./config"
import path from 'path'

export default class App {
    static instance: App
    public mainWindow:BrowserWindow
    constructor(){
        this.createWindow()
        this.mainWindow.loadFile(path.join(__dirname, '../render/index.html'))
        this.mainWindow.once('ready-to-show',()=>this.mainWindow.show())
        globalShortcut.register('CommandOrControl+D', this.openDev)
        globalShortcut.register('CommandOrControl+R', this.reload)
    }

    static getInstance(){
        if(!App.instance){
            App.instance = new App
        }
        return App.instance
    }

    browserWindowOptionsBuilder(): BrowserWindowConstructorOptions{
        return getOptions()
    }

    createWindow(){
        const options = addDevOption(this.browserWindowOptions)
        this.mainWindow = new BrowserWindow(options)
    }

    openDev(){
        App.getInstance().mainWindow.webContents.openDevTools()
    }
      
    reload(){
        App.getInstance().mainWindow.webContents.reload()
    }

    get browserWindowOptions(){
        return this.browserWindowOptionsBuilder()
    }
}