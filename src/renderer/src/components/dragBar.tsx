import { SettingsSVG } from '@renderer/assets/settingsIcon'
import { FC } from 'react'
import { WINDOW_TYPE } from 'src/preload/windowApi'

export const DragBar: FC<{
  hideSettings?: boolean
  title?: string
  hideMinimize?: boolean
  type?: WINDOW_TYPE
}> = ({ title, hideMinimize, hideSettings, type = 'main' }) => {
  return (
    <>
      <div
        className="h-[1.94rem] w-full bg-slate-900 text-white select-none flex bg-opacity-20"
        style={{ appRegion: 'drag' }}
      >
        <div className="flex-grow flex items-center text-center">{title}</div>
        <div className="flex">
          {hideSettings ? null : (
            <button
              className="w-8 h-full hover:bg-red-700 flex items-center justify-center"
              style={{ appRegion: 'no-drag' }}
              onClick={() => {
                window.api.openSettings()
              }}
            >
              <SettingsSVG
                svg={{ className: 'w-[70%] h-[70%] hover:animate-spin animate-none' }}
                inside={{ style: { fill: 'white' } }}
                outside={{ style: { fill: 'white' } }}
              />
            </button>
          )}
          {hideMinimize ? null : (
            <button
              className="w-8 h-full hover:bg-gray-700"
              style={{ appRegion: 'no-drag' }}
              onClick={() => {
                window.api.minimize()
              }}
            >
              -
            </button>
          )}
          <button
            className="w-8 h-full hover:bg-red-300 hover:text-black"
            style={{ appRegion: 'no-drag' }}
            onClick={() => {
              window.api.closeWindow(type)
            }}
          >
            X
          </button>
        </div>
      </div>
    </>
  )
}
