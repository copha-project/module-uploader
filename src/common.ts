import os from 'os'
import { validate } from 'uuid'

export const isWin32 = os.platform() === 'win32'
export const isMac = os.platform() === 'darwin'
export const isDev = process.env.NODE_ENV === "development"
export function isUUID(s: string) {
    return validate(s)
}