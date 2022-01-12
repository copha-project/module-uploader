import electron,{ app, BrowserViewConstructorOptions, screen } from 'electron'

export function changeDisplayPosition(options: BrowserViewConstructorOptions){
    if(app.isReady){
        const displays = screen.getAllDisplays()
        const externalDisplay = displays.find((display) => {
            return display.bounds.x !== 0 || display.bounds.y !== 0
        })

        if (externalDisplay) {
            return {
                x: externalDisplay.bounds.x + 50,
                y: externalDisplay.bounds.y + 50
            }
        }

        return {
            x: displays[0].bounds.x + 50,
            y: displays[0].bounds.y + 550
        }
    }
}

export function changeWebPreferences(options: BrowserViewConstructorOptions): electron.BrowserWindowConstructorOptions {
    return {
        webPreferences:{
            ...options.webPreferences,
            devTools: true,
            nodeIntegration: true
        }
    }
}