import { DragBar } from '@renderer/components/dragBar'
import { useSettings } from '@renderer/useSettings'
import { Editor } from './Editor'

function App(): JSX.Element {
  const sD = useSettings()
  return (
    <>
      <DragBar title={!sD ? '' : `${sD.appName} (v${sD.appVersion})`} />
      {!sD ? (
        <>Loading..</>
      ) : (
        <>
          {sD.path ? (
            <Editor />
          ) : (
            <div className="flex justify-center">
              <span className="text-orange-300">
                Could not automatically find your CS2 installation! Please select it manually in the
                options
              </span>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default App
