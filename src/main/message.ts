import { dialog, BrowserWindow, nativeImage } from "electron"
import { MessageIcons } from "./constants"
import { MessageType } from "./common/enums"

const showMessage = async (msg: string, title: string, type: MessageType)=>{
    return dialog.showMessageBox(BrowserWindow.getFocusedWindow(),{
        type: 'info',
        message: msg || "no message",
        title: title || '',
        icon: nativeImage.createFromPath(MessageIcons[type])
    })
}

export const showErrorMessage = (msg: string, title: string) => {
    return showMessage(msg || 'unknow error', title, MessageType.Error)
}

export const showInfoMessage = (msg: string, title: string) => {
    return showMessage(msg, title, MessageType.Info)
}