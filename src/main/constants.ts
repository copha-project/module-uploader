import path from 'path'
import { MessageType } from "./common/enums"

export const MessageIcons = {
    [MessageType.Info]: path.resolve(__dirname, '../assets/image/info.png'),
    [MessageType.Error]: path.resolve(__dirname, '../assets/image/error.png')
}
