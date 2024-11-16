import { app, shell, BrowserWindow, ipcMain, Menu, systemPreferences, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { existsSync, readdirSync, readFileSync } from 'fs'
import { Settings } from './settings'
import { WindowAPI, WindowAPIParam, WindowAPIResult } from '../preload/windowAPI'

const handleIPC = <T extends keyof WindowAPI>(
  channel: T,
  handler: (ev: Electron.IpcMainInvokeEvent, ...params: WindowAPIParam<T>) => WindowAPIResult<T>
) => {
  ipcMain.handle(channel, handler)
}

function createWindow(
  {
    path,
    height,
    hideMenuBar,
    modal,
    parent,
    width,
    menu,
    resizable,
    show = true
  }: {
    parent?: BrowserWindow
    modal?: boolean
    path: string
    width?: number
    height?: number
    menu?: Menu
    hideMenuBar?: boolean
    resizable?: boolean
    show?: boolean
  } = { path: '' }
): BrowserWindow {
  // Create the browser window.
  const newWindow = new BrowserWindow({
    width: width ?? 800,
    height: height ?? 600,
    show: false,
    autoHideMenuBar: hideMenuBar ?? true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    resizable,
    parent,
    transparent: true,
    roundedCorners: true,
    frame: false,
    modal,
    titleBarStyle: 'hidden'
  })

  newWindow.setMenu(menu ?? null)

  newWindow.on('ready-to-show', () => {
    if (show) newWindow.show()
    newWindow.webContents.send('settingsData', settings.getData())
    settings.windows.push(newWindow)
  })

  newWindow.on('closed', () => {
    settings.windows.splice(settings.windows.indexOf(newWindow), 1)
  })

  newWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    newWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + path)
  } else {
    newWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return newWindow
}

const DEFAULT_CS_PATHS = [
  'D:\\SteamLibrary\\steamapps\\common\\Counter-Strike Global Offensive\\game\\csgo',
  'E:\\SteamLibrary\\steamapps\\common\\Counter-Strike Global Offensive\\game\\csgo',
  'F:\\SteamLibrary\\steamapps\\common\\Counter-Strike Global Offensive\\game\\csgo',
  'G:\\SteamLibrary\\steamapps\\common\\Counter-Strike Global Offensive\\game\\csgo',
  'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive\\csgo'
]

const checkDefaultCS2Paths = () => {
  for (const path of DEFAULT_CS_PATHS) {
    if (existsSync(path)) {
      return path
    }
  }
  return null
}

const settings = new Settings(
  { path: checkDefaultCS2Paths() ?? '', appName: app.getName(), appVersion: app.getVersion() },
  []
)

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const main = createWindow({
    path: '',
    hideMenuBar: false,
    resizable: false
  })

  const sWindow = createWindow({
    path: '/settings',
    parent: main,
    height: 300,
    width: 500,
    hideMenuBar: false,
    modal: true,
    resizable: false,
    show: false
  })

  systemPreferences.on('accent-color-changed', (_ev, c) => {
    main.webContents.send('focus-changed', c)
  })

  /// Handle all API requests

  handleIPC('closeWindow', (_ev, p) => {
    if (p === 'modal') {
      sWindow.hide()
    } else {
      main.close()
    }
  })

  handleIPC('minimize', () => {
    main.minimize()
  })

  handleIPC('openSettings', () => {
    sWindow.show()
  })

  handleIPC('changeSetting', (_ev, setting, value) => {
    settings.changeValues(setting, value)
  })

  handleIPC('selectNewPath', async () => {
    const path = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    settings.changeValues('path', path.filePaths[0])
  })

  handleIPC('getFileList', async (): Promise<string[]> => {
    const csPath = settings.getData().path
    if (!csPath) {
      return []
    }

    const annoPath = join(csPath, 'annotations')

    if (!existsSync(annoPath)) return []
    const files = readdirSync(annoPath)

    return files.filter((f) => f.endsWith('.txt'))
  })

  handleIPC('getFile', (_ev, path) => {
    console.log('Loading ', path)
    const csPath = settings.getData().path
    if (!path || !csPath) return null

    const filePath = join(csPath, 'annotations', path)

    console.log('Final path:', filePath)

    if (!existsSync(filePath)) return null

    const data = readFileSync(filePath, 'utf-8')
    return data
  })

  // IPC test

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
