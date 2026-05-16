import { useState } from 'react'
import { Upload, Trash2, FileText, Image, File, FileType } from 'lucide-react'
import { useClients } from '../../../store/ClientsContext'
import type { ClientFile } from '../../../types'

interface Props {
  clientId: string
  files: ClientFile[]
}

const fileIcons: Record<ClientFile['fileType'], React.ReactNode> = {
  pdf:   <FileText size={20} className="text-red-400" />,
  image: <Image size={20} className="text-blue-400" />,
  doc:   <FileType size={20} className="text-indigo-400" />,
  other: <File size={20} className="text-gray-400" />,
}

const fileTypeBg: Record<ClientFile['fileType'], string> = {
  pdf:   'bg-red-50',
  image: 'bg-blue-50',
  doc:   'bg-indigo-50',
  other: 'bg-gray-50',
}

function detectType(name: string): ClientFile['fileType'] {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  if (['pdf'].includes(ext)) return 'pdf'
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image'
  if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return 'doc'
  return 'other'
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FilesTab({ clientId, files }: Props) {
  const { addFile, deleteFile } = useClients()
  const [dragging, setDragging] = useState(false)

  function simulateUpload(fileName: string, size: number) {
    addFile(clientId, {
      name: fileName,
      fileType: detectType(fileName),
      size: formatSize(size),
    })
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files
    if (!picked) return
    Array.from(picked).forEach(f => simulateUpload(f.name, f.size))
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    Array.from(e.dataTransfer.files).forEach(f => simulateUpload(f.name, f.size))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{files.length} קבצים</p>
        <label className="flex items-center gap-2 bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-emerald-600 transition-colors cursor-pointer">
          <Upload size={15} />
          העלה קובץ
          <input type="file" multiple className="hidden" onChange={handleFileInput} />
        </label>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center mb-4 transition-all ${
          dragging ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-gray-50'
        }`}
      >
        <Upload size={24} className={`mx-auto mb-2 ${dragging ? 'text-emerald-400' : 'text-gray-300'}`} />
        <p className="text-sm text-gray-400">גרור קבצים לכאן להעלאה</p>
      </div>

      {files.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">אין קבצים עדיין</p>
      ) : (
        <div className="space-y-2">
          {files.map(file => (
            <div key={file.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${fileTypeBg[file.fileType]}`}>
                {fileIcons[file.fileType]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{file.size} · {file.uploadedAt}</p>
              </div>
              <button
                onClick={() => deleteFile(clientId, file.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
