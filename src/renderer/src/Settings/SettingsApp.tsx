import { useSettings } from '@renderer/useSettings'

function App(): JSX.Element {
  const sD = useSettings()

  if (!sD) return <>Loading...</>

  return (
    <div className="p-3 flex justify-center">
      <div>
        <label>CS2 Path: </label>
        <input
          id="cs2path"
          value={sD.path}
          disabled
          className="disabled:text-black m-2"
          title={sD.path}
          style={{ border: sD.path ? '' : '1px solid red' }}
        />
        <button
          onClick={() => {
            window.api.selectNewPath()
          }}
        >
          {!sD.path ? 'SELECT' : 'CHANGE'}
        </button>
      </div>
    </div>
  )
}

export default App
