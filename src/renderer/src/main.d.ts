import 'react'
import 'src/preload/windowApi'

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number
    appRegion?: 'drag' | 'no-drag' | 'initial' | 'unset' | 'inherit'
  }
}
