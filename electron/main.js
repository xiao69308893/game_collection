// electron/main.js - Electron 主进程
const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'

// 保持对窗口对象的全局引用
let mainWindow

function createWindow() {
    // 创建浏览器窗口
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: !isDev
        },
        icon: path.join(__dirname, '../dist/favicon.ico'),
        show: false,
        titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default'
    })

    // 加载应用
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173')
        // 开发环境下打开开发者工具
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    }

    // 窗口准备好后显示
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()

        // 在开发环境中自动聚焦
        if (isDev) {
            mainWindow.focus()
        }
    })

    // 当窗口关闭时触发
    mainWindow.on('closed', () => {
        mainWindow = null
    })

    // 在外部浏览器中打开链接
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url)
        return { action: 'deny' }
    })

    // 设置菜单
    createMenu()
}

function createMenu() {
    const template = [
        {
            label: '文件',
            submenu: [
                {
                    label: '新游戏',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        mainWindow.webContents.send('menu-new-game')
                    }
                },
                {
                    label: '保存游戏',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => {
                        mainWindow.webContents.send('menu-save-game')
                    }
                },
                {
                    label: '加载游戏',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => {
                        mainWindow.webContents.send('menu-load-game')
                    }
                },
                { type: 'separator' },
                {
                    label: '退出',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit()
                    }
                }
            ]
        },
        {
            label: '游戏',
            submenu: [
                {
                    label: '俄罗斯方块',
                    click: () => {
                        mainWindow.webContents.send('navigate-to', '/games/tetris')
                    }
                },
                {
                    label: '贪吃蛇',
                    click: () => {
                        mainWindow.webContents.send('navigate-to', '/games/snake')
                    }
                },
                {
                    label: '拼图游戏',
                    click: () => {
                        mainWindow.webContents.send('navigate-to', '/games/puzzle')
                    }
                },
                {
                    label: '记忆翻牌',
                    click: () => {
                        mainWindow.webContents.send('navigate-to', '/games/memory')
                    }
                }
            ]
        },
        {
            label: '视图',
            submenu: [
                {
                    label: '重新加载',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => {
                        mainWindow.reload()
                    }
                },
                {
                    label: '强制重新加载',
                    accelerator: 'CmdOrCtrl+Shift+R',
                    click: () => {
                        mainWindow.webContents.reloadIgnoringCache()
                    }
                },
                {
                    label: '开发者工具',
                    accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
                    click: () => {
                        mainWindow.webContents.toggleDevTools()
                    }
                },
                { type: 'separator' },
                {
                    label: '实际大小',
                    accelerator: 'CmdOrCtrl+0',
                    click: () => {
                        mainWindow.webContents.zoomLevel = 0
                    }
                },
                {
                    label: '放大',
                    accelerator: 'CmdOrCtrl+Plus',
                    click: () => {
                        mainWindow.webContents.zoomLevel += 0.5
                    }
                },
                {
                    label: '缩小',
                    accelerator: 'CmdOrCtrl+-',
                    click: () => {
                        mainWindow.webContents.zoomLevel -= 0.5
                    }
                },
                { type: 'separator' },
                {
                    label: '切换全屏',
                    accelerator: process.platform === 'darwin' ? 'Ctrl+Cmd+F' : 'F11',
                    click: () => {
                        mainWindow.setFullScreen(!mainWindow.isFullScreen())
                    }
                }
            ]
        },
        {
            label: '帮助',
            submenu: [
                {
                    label: '关于',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: '关于 Game Collection',
                            message: 'Game Collection v1.0.0\n经典游戏集合应用',
                            detail: '支持俄罗斯方块、贪吃蛇、拼图和记忆游戏等经典游戏。\n\n© 2024 Game Collection. All rights reserved.',
                            buttons: ['确定']
                        })
                    }
                }
            ]
        }
    ]

    // macOS 菜单调整
    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                {
                    label: '关于 ' + app.getName(),
                    role: 'about'
                },
                { type: 'separator' },
                {
                    label: '服务',
                    role: 'services',
                    submenu: []
                },
                { type: 'separator' },
                {
                    label: '隐藏 ' + app.getName(),
                    accelerator: 'Command+H',
                    role: 'hide'
                },
                {
                    label: '隐藏其他',
                    accelerator: 'Command+Shift+H',
                    role: 'hideothers'
                },
                {
                    label: '显示全部',
                    role: 'unhide'
                },
                { type: 'separator' },
                {
                    label: '退出',
                    accelerator: 'Command+Q',
                    click: () => {
                        app.quit()
                    }
                }
            ]
        })
    }

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

// IPC 处理程序
ipcMain.handle('app-version', () => {
    return app.getVersion()
})

ipcMain.handle('show-save-dialog', async () => {
    const result = await dialog.showSaveDialog(mainWindow, {
        title: '保存游戏',
        defaultPath: 'game-save.json',
        filters: [
            { name: '游戏存档', extensions: ['json'] },
            { name: '所有文件', extensions: ['*'] }
        ]
    })
    return result
})

ipcMain.handle('show-open-dialog', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        title: '加载游戏',
        filters: [
            { name: '游戏存档', extensions: ['json'] },
            { name: '所有文件', extensions: ['*'] }
        ],
        properties: ['openFile']
    })
    return result
})

// 应用事件处理
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('before-quit', (event) => {
    // 在这里可以添加保存数据的逻辑
})

// electron/preload.js - 预加载脚本
const { contextBridge, ipcRenderer } = require('electron')

// 向渲染进程暴露 API
contextBridge.exposeInMainWorld('electronAPI', {
    // 应用信息
    getVersion: () => ipcRenderer.invoke('app-version'),

    // 文件操作
    showSaveDialog: () => ipcRenderer.invoke('show-save-dialog'),
    showOpenDialog: () => ipcRenderer.invoke('show-open-dialog'),

    // 菜单事件监听
    onMenuAction: (callback) => {
        ipcRenderer.on('menu-new-game', callback)
        ipcRenderer.on('menu-save-game', callback)
        ipcRenderer.on('menu-load-game', callback)
        ipcRenderer.on('navigate-to', callback)
    },

    // 移除事件监听
    removeAllListeners: (channel) => {
        ipcRenderer.removeAllListeners(channel)
    }
})

