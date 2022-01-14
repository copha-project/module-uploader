import { BrowserWindowConstructorOptions, BrowserWindow, globalShortcut, app } from "electron"
import { addDevOption } from "../dev"
import { getOptions } from "./config"
import path from 'path'
import Invoke from "./invoke"
import { setAppMenu } from "./menu"
import { isDev } from "../common"
export default class App extends Invoke {
    static instance: App
    public mainWindow:BrowserWindow
    constructor(){
        super()
        setAppMenu()
        this.registerShortcut()
        this.createWindow()
    }

    static getInstance(){
        if(!this.instance){
            this.instance = new App
        }
        return this.instance
    }

    browserWindowOptionsBuilder(): BrowserWindowConstructorOptions{
        return getOptions()
    }

    createWindow(){
        const options = addDevOption(this.browserWindowOptions)
        this.mainWindow = new BrowserWindow(options)
        this.mainWindow.loadFile(path.join(__dirname, '../render/index.html'))
        this.mainWindow.once('ready-to-show',()=>this.mainWindow.show())
    }

    registerShortcut(){
        if(isDev){
            globalShortcut.register('CommandOrControl+D', this.openDev)
            globalShortcut.register('CommandOrControl+R', this.reload)
        }
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