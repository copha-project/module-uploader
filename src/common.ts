import os from 'os'

export const isWin32 = os.platform() === 'win32'
export const isMac = os.platform() === 'darwin'
export const isDev = process.env.NODE_ENV === "development"