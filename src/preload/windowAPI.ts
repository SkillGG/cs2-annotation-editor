import { ipcRenderer } from 'electron'
import { SettingsData } from '../main/settings'

export type WINDOW_TYPE = 'main' | 'modal'

export const api = {
  async getFile(s): Promise<string | null> {
    const response = await ipcRenderer.invoke('getFile', s)
    return response
  },
  async getFileList(): Promise<string[]> {
    const response = await ipcRenderer.invoke('getFileList')
    return response
  },
  closeWindow(window: WINDOW_TYPE = 'main') {
    ipcRenderer.invoke('closeWindow', window)
  },
  minimize() {
    ipcRenderer.invoke('minimize')
  },
  openSettings() {
    ipcRenderer.invoke('openSettings')
  },
  changeSetting<T extends keyof SettingsData>(setting: T, value: SettingsData[T]) {
    ipcRenderer.invoke('changeSetting', setting, value)
  },
  selectNewPath() {
    ipcRenderer.invoke('selectNewPath')
  }
}

export const exportTypes = {
  getFile: [['' as string], '' as string | null] as const,
  getFileList: [[], new Promise<string[]>(() => {})],
  minimize: [[], undefined],
  selectNewPath: [[], undefined],
  openSettings: [[], undefined],
  closeWindow: [['main' as WINDOW_TYPE | undefined], undefined],
  changeSetting: [['path', ''] as Parameters<WindowAPI['changeSetting']>, undefined] as const
} satisfies Record<keyof WindowAPI, [unknown[], unknown]>

export type ExportType<T extends keyof WindowAPI> = (typeof exportTypes)[T]

export type WindowAPIParam<T extends keyof WindowAPI> =
  NonNullable<ExportType<T>[0][number]> extends never ? [undefined] : ExportType<T>[0]

export type WindowAPIResult<T extends keyof WindowAPI> =
  NonNullable<ExportType<T>[1]> extends never ? void : ExportType<T>[1]

export type WindowAPI = typeof api

export const subscriptions = {
  settingsData: {
    subscribe: (callback: (d: SettingsData) => void) => {
      ipcRenderer.on('settingsData', (_ev, d) => callback(d as SettingsData))
    },
    unsubscribe: () => {
      ipcRenderer.removeAllListeners('settingsData')
    }
  }
} satisfies Record<
  string,
  { subscribe: (callback: (...p: unknown[]) => void) => void; unsubscribe: () => void }
>

export type SubscribeAPI = typeof subscriptions
