import { useEffect, useState } from 'react'
import { SettingsData } from 'src/main/settings'

export const useSettings = () => {
  const [sD, setSD] = useState<SettingsData | null>()
  useEffect(() => {
    window.settingsData.subscribe((d) => {
      console.log(`Settings changed!`, d)
      setSD(d)
    })
    return () => {
      window.settingsData.unsubscribe()
    }
  }, [])
  return sD
}
