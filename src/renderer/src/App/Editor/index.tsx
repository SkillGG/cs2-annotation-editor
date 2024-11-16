import { useAnnotationFiles } from './useAnnotationFiles'

export const Editor = () => {
  const { files, selectedFile, select, data, loading } = useAnnotationFiles()

  return (
    <div>
      {files.length === 0 ? (
        <>
          <div className="justify-center text-orange-300">
            THERE ARE NO FILES TO EDIT! CREATE ONE IN-GAME TO EDIT THEM!
          </div>
        </>
      ) : (
        <div className="flex">
          <div className="basis-[33vw] m-2 flex flex-col max-h-[95vh] overflow-y-auto mr-2 border-[1px] border-slate-300 h-fit ">
            {files.map((file, i) => {
              return (
                <button
                  className="w-full select-none hover:bg-slate-50 hover:bg-opacity-30 bg-[--bg] px-3 self-center"
                  style={{
                    '--bg': file === selectedFile ? '#aaffaa44' : i % 2 === 0 ? '#fff9' : '#fff4'
                  }}
                  key={file}
                  disabled={loading}
                  onClick={() => {
                    select(file)
                  }}
                >
                  {file.replace(/.txt$/i, '')}
                </button>
              )
            })}
          </div>
          <div className="flex-grow text-balance text-center basis-[30vw] max-h-[90vh] overflow-auto">
            {data?.split('\n').map((q) => (
              <>
                {q}
                <br />
              </>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
