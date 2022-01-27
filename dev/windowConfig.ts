import {BrowserWindowConstructorOptions, screen } from 'electron'
import { isWin32 } from './dev'

export function changeDisplayPosition(): BrowserWindowConstructorOptions{
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
        y: displays[0].bounds.y + 50
    }
}

export function changeWebPreferences(): BrowserWindowConstructorOptions {
    const options: BrowserWindowConstructorOptions = {
        webPreferences:{
            devTools: true,
            nodeIntegration: true
        }
    }
    if(isWin32){
        // options.frame = true
        // options.height = 700
    }
    return options
}