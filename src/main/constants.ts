import path from 'path'
import { MessageType } from "./common/enums"

export const updateUrl = 'https://github.com/copha-project/module-uploader/releases'

export const MessageIcons = {
    [MessageType.Info]: path.resolve(__dirname, '../assets/image/info.png'),
    [MessageType.Error]: path.resolve(__dirname, '../assets/image/error.png')
}

export const appIcon = path.resolve(__dirname, '../assets/image/icon360x360.png')