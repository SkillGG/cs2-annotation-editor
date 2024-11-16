import { BrowserWindow } from 'electron'

export type SettingsData = {
  path: string
  appName: string
  appVersion: string
}

export class Settings {
  #data: SettingsData
  windows: BrowserWindow[]
  constructor(
    defaultData: SettingsData = { path: '', appName: '', appVersion: '' },
    windows: BrowserWindow[]
  ) {
    this.#data = defaultData
    this.windows = windows
  }
  emit() {
    for (const w of this.windows) {
      w.webContents.send('settingsData', { ...this.#data })
    }
  }
  getData() {
    return { ...this.#data }
  }
  changeData(settings: Partial<SettingsData>) {
    for (const key in settings) {
      this.#data[key] = settings[key]
    }
    this.emit()
  }
  changeValues<T extends keyof SettingsData>(setting: T, value: SettingsData[T]) {
    this.#data[setting] = value
    this.emit()
  }
  getValue<T extends keyof SettingsData>(key: T): SettingsData[T] {
    return this.#data[key]
  }
}
