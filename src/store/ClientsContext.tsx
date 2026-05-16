import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { ClientDetail, Script, VideoContent, ClientFile, BrandProfile } from '../types'
import { mockClientDetails } from '../data/mockData'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

interface ClientsContextType {
  clients: ClientDetail[]
  getClient: (id: string) => ClientDetail | undefined
  addClient: (data: Omit<ClientDetail, 'id' | 'scripts' | 'videos' | 'files' | 'createdAt'>) => void
  updateClientStatus: (id: string, status: ClientDetail['status']) => void
  addScript: (clientId: string, script: Omit<Script, 'id' | 'createdAt'>) => void
  updateScript: (clientId: string, scriptId: string, updates: Partial<Script>) => void
  deleteScript: (clientId: string, scriptId: string) => void
  addVideo: (clientId: string, video: Omit<VideoContent, 'id' | 'createdAt'>) => void
  updateVideo: (clientId: string, videoId: string, updates: Partial<VideoContent>) => void
  deleteVideo: (clientId: string, videoId: string) => void
  addFile: (clientId: string, file: Omit<ClientFile, 'id' | 'uploadedAt'>) => void
  deleteFile: (clientId: string, fileId: string) => void
  updateBrandProfile: (clientId: string, profile: BrandProfile) => void
}

const ClientsContext = createContext<ClientsContextType | null>(null)

let nextId = 100

function uid() { return String(++nextId) }
function today() { return new Date().toISOString().slice(0, 10) }

export function ClientsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [clients, setClients] = useState<ClientDetail[]>(mockClientDetails)

  // Load saved brand profiles from Supabase and merge with local data
  useEffect(() => {
    if (!user) return
    supabase
      .from('brand_profiles')
      .select('client_id, profile')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (!data || data.length === 0) return
        setClients(cs => cs.map(c => {
          const saved = data.find((d: { client_id: string; profile: BrandProfile }) => d.client_id === c.id)
          return saved ? { ...c, brandProfile: saved.profile as BrandProfile } : c
        }))
      })
  }, [user?.id])

  function updateClient(id: string, fn: (c: ClientDetail) => ClientDetail) {
    setClients(cs => cs.map(c => c.id === id ? fn(c) : c))
  }

  const ctx: ClientsContextType = {
    clients,
    getClient: (id) => clients.find(c => c.id === id),

    addClient: (data) => {
      const newClient: ClientDetail = {
        ...data, id: uid(), createdAt: today(), scripts: [], videos: [], files: [],
      }
      setClients(cs => [newClient, ...cs])
    },

    updateClientStatus: (id, status) => updateClient(id, c => ({ ...c, status })),

    addScript: (clientId, script) => updateClient(clientId, c => ({
      ...c, scripts: [...c.scripts, { ...script, id: uid(), createdAt: today() }],
    })),
    updateScript: (clientId, scriptId, updates) => updateClient(clientId, c => ({
      ...c, scripts: c.scripts.map(s => s.id === scriptId ? { ...s, ...updates } : s),
    })),
    deleteScript: (clientId, scriptId) => updateClient(clientId, c => ({
      ...c, scripts: c.scripts.filter(s => s.id !== scriptId),
    })),

    addVideo: (clientId, video) => updateClient(clientId, c => ({
      ...c, videos: [...c.videos, { ...video, id: uid(), createdAt: today() }],
    })),
    updateVideo: (clientId, videoId, updates) => updateClient(clientId, c => ({
      ...c, videos: c.videos.map(v => v.id === videoId ? { ...v, ...updates } : v),
    })),
    deleteVideo: (clientId, videoId) => updateClient(clientId, c => ({
      ...c, videos: c.videos.filter(v => v.id !== videoId),
    })),

    addFile: (clientId, file) => updateClient(clientId, c => ({
      ...c, files: [...c.files, { ...file, id: uid(), uploadedAt: today() }],
    })),
    deleteFile: (clientId, fileId) => updateClient(clientId, c => ({
      ...c, files: c.files.filter(f => f.id !== fileId),
    })),

    updateBrandProfile: (clientId, profile) => {
      updateClient(clientId, c => ({ ...c, brandProfile: profile }))
      // Persist to Supabase (fire-and-forget)
      if (user) {
        supabase.from('brand_profiles').upsert(
          { user_id: user.id, client_id: clientId, profile },
          { onConflict: 'user_id,client_id' }
        ).then(() => {})
      }
    },
  }

  return <ClientsContext.Provider value={ctx}>{children}</ClientsContext.Provider>
}

export function useClients() {
  const ctx = useContext(ClientsContext)
  if (!ctx) throw new Error('useClients must be used within ClientsProvider')
  return ctx
}
