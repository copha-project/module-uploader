import { BrowserWindowConstructorOptions, BrowserWindow, globalShortcut, app } from "electron"
import { addDevOption, openDevTool } from "../dev"
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
        console.log("main window options :",options);
        this.mainWindow = new BrowserWindow(options)
        this.mainWindow.loadFile(path.join(__dirname, '../render/index.html'))
        this.mainWindow.once('ready-to-show',()=>{
            this.mainWindow.show()
            this.mainWindow.reload()
        })
    }

    registerShortcut(){
    }

    quit(){
        console.log("ready to exit app");
        this.mainWindow.close()
        app.quit()
    }

    openDev(){
        openDevTool()
    }
      
    reload(){
        App.getInstance().mainWindow.webContents.reload()
    }

    get browserWindowOptions(){
        return this.browserWindowOptionsBuilder()
    }
}