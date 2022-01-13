import { app, Menu, shell, MenuItemConstructorOptions } from "electron"

const template: MenuItemConstructorOptions[] = [
    {
        label: app.name,
        submenu: [
            { role: 'about'},
            {
                label: 'check upgrade',
                click: async () => shell.openExternal('https://copha.net')
            },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    },
    {
        role: 'viewMenu'
    },
    {
        role: 'windowMenu'
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Copha Doc Page',
                click: async () => shell.openExternal('https://copha.net')
            }
        ]
    }
]

export function setAppMenu(){
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}