import React from 'react'
import ReactDOM from 'react-dom/client'
import '../assets/main.css'
import '../assets/settings.css'
import SettingsApp from './SettingsApp'
import { DragBar } from '@renderer/components/dragBar'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <DragBar hideMinimize hideSettings type="modal" />
    <SettingsApp />
  </React.StrictMode>
)
