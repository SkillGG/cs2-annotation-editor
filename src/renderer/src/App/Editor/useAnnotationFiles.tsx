import { useCallback, useEffect, useState } from 'react'

export const useAnnotationFiles = () => {
  const [files, setFiles] = useState<string[]>([])

  const [loading, setLoading] = useState(false)

  const [selectedFile, selectFile] = useState<string | null>(null)

  const [data, setData] = useState<string | null>(null)

  const select = useCallback((str: string) => {
    setLoading(true)
    ;(async () => {
      console.log('getting data for', str)
      const fileData = await window.api.getFile(str)

      if (fileData) {
        setData(fileData)
        selectFile(str)
      }
      setLoading(false)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const files = await window.api.getFileList()
      setFiles(files)
    })()
  }, [])
  return { files, selectedFile, select, data, loading }
}
