import { ElectronAPI } from '@electron-toolkit/preload'

import { SubscribeAPI, WindowAPI } from './windowApi'

declare global {
  interface Window extends SubscribeAPI {
    electron: ElectronAPI
    api: WindowAPI
    appVersion: string
    appName: string
  }
}
