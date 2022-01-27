import { BrowserWindowConstructorOptions, BrowserWindow, globalShortcut, app, net } from "electron"
import { getOptions, API } from "./config"
import path from 'path'
import Invoke from "./invoke"
import { merge } from "lodash"
import { setAppMenu } from "./menu"
import { isMac, fetch } from '../common'
export default class App extends Invoke {
    static instance: App
    public mainWindow:BrowserWindow
    constructor(){
        super()
        setAppMenu()
        this.registerShortcut()
    }

    static getInstance(){
        if(!this.instance){
            this.instance = new App
        }
        return this.instance
    }
    
    launch(){
        this.initApp(this.browserWindowOptionsBuilder)
    }

    launchWithOptionsBuilder(optionsBuilder: ()=>BrowserWindowConstructorOptions){
        this.initApp(optionsBuilder)
    }

    initApp(optionsBuilder?: ()=>BrowserWindowConstructorOptions){
        if (require('electron-squirrel-startup')) {
            this.quit()
        }

        app.on('ready', async ()=> {
            App.getInstance().createWindow(optionsBuilder())
        })

        app.on('window-all-closed', () => {
            if (!isMac) {
              App.getInstance().quit()
            }
        })

        app.on('activate', function(){
            // On OS X it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) {
                App.getInstance().createWindow(optionsBuilder())
            }
        })
    }

    browserWindowOptionsBuilder(): BrowserWindowConstructorOptions{
        return getOptions()
    }

    createWindow(options:BrowserWindowConstructorOptions){
        options = merge(this.browserWindowOptions, options || {})
        console.log("main window options :",options)
        this.mainWindow = new BrowserWindow(options)
        this.mainWindow.loadFile(path.join(__dirname, '../render/index.html'))
        this.mainWindow.once('ready-to-show',()=>{
            this.mainWindow.show()
            // this.mainWindow.reload()
        })
    }

    registerShortcut(){
    }

    async getUploadPoint(){
        let hostsInfo: uploadPointResp
        try {
            hostsInfo = await fetch(API.packagePoints) as uploadPointResp 
        } catch (error) {
            console.log('app', error);
        }
        if (!hostsInfo || hostsInfo.hosts?.length === 0) throw Error("not found a upload Point")
        return hostsInfo.hosts[0] + hostsInfo.api.upload
    }

    openDevTools(){
        this.mainWindow.webContents.openDevTools()
    }
    quit(){
        console.log("ready to exit app")
        this.mainWindow?.close()
        app.quit();
    }
      
    reload(){
        App.getInstance().mainWindow.webContents.reload()
    }
    
    get browserWindowOptions(){
        return this.browserWindowOptionsBuilder()
    }
}