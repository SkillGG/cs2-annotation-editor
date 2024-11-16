import { contextBridge } from 'electron'
import { ElectronAPI, electronAPI } from '@electron-toolkit/preload'
import { api, SubscribeAPI, subscriptions } from './windowAPI'

declare global {
  interface Window extends SubscribeAPI {
    electron: ElectronAPI
    api: typeof api
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    for (const key in subscriptions) {
      contextBridge.exposeInMainWorld(key, subscriptions[key])
    }
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
  for (const key in subscriptions) {
    window[key] = subscriptions[key]
  }
}
