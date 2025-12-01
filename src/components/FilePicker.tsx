import React, { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { fileToDataURL } from '@/utils/db'

interface FilePickerProps {
  label: string
  accept?: string
  onFileSelected: (url: string) => void
}

const FilePicker: React.FC<FilePickerProps> = ({ label, accept = 'image/*', onFileSelected }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')

  const handleClick = () => inputRef.current?.click()

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await fileToDataURL(file)
    setFileName(file.name)
    onFileSelected(url)
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Upload size={14} />
        <span>{label}</span>
      </button>
      {fileName && <div className="text-xs text-gray-400 truncate max-w-[16rem]">{fileName}</div>}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
    </div>
  )
}

export default FilePicker
