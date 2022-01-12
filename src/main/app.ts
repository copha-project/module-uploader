import { BrowserWindowConstructorOptions, BrowserWindow, globalShortcut, app } from "electron"
import { addDevOption } from "../dev"
import { getOptions } from "./config"
import path from 'path'
import Invoke from "./invoke"
export default class App extends Invoke {
    static instance: App
    public mainWindow:BrowserWindow
    constructor(){
        super()
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
        console.log(options);
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