import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import type { InstagramConnection } from '../types'

interface NewConnection {
  igUserId:    string
  igUsername:  string
  pageId:      string
  accessToken: string
  expiresAt?:  string
}

interface InstagramContextType {
  connections: InstagramConnection[]
  loading: boolean
  getConnection: (clientId: string) => InstagramConnection | undefined
  saveConnection: (clientId: string, data: NewConnection) => Promise<void>
  disconnectClient: (clientId: string) => Promise<void>
}

const InstagramContext = createContext<InstagramContextType | null>(null)

function rowToConnection(row: Record<string, unknown>): InstagramConnection {
  return {
    id:             row.id as string,
    clientId:       row.client_id as string,
    igUserId:       row.ig_user_id as string,
    igUsername:     (row.ig_username as string) ?? '',
    pageId:         row.page_id as string,
    accessToken:    row.access_token as string,
    tokenExpiresAt: row.token_expires_at as string | undefined,
    createdAt:      row.created_at as string,
  }
}

export function InstagramProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [connections, setConnections] = useState<InstagramConnection[]>([])
  const [loading, setLoading]         = useState(false)

  useEffect(() => {
    if (!user) { setConnections([]); return }
    load()
  }, [user?.id])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('instagram_connections')
      .select('*')
      .eq('user_id', user!.id)
    if (data) setConnections(data.map(rowToConnection))
    setLoading(false)
  }

  async function saveConnection(clientId: string, data: NewConnection) {
    if (!user) return
    const { data: row, error } = await supabase
      .from('instagram_connections')
      .upsert({
        user_id:           user.id,
        client_id:         clientId,
        ig_user_id:        data.igUserId,
        ig_username:       data.igUsername,
        page_id:           data.pageId,
        access_token:      data.accessToken,
        token_expires_at:  data.expiresAt ?? null,
      }, { onConflict: 'user_id,client_id' })
      .select()
      .single()
    if (!error && row) {
      const conn = rowToConnection(row)
      setConnections(cs => [...cs.filter(c => c.clientId !== clientId), conn])
    }
  }

  async function disconnectClient(clientId: string) {
    if (!user) return
    await supabase.from('instagram_connections').delete().eq('user_id', user.id).eq('client_id', clientId)
    setConnections(cs => cs.filter(c => c.clientId !== clientId))
  }

  return (
    <InstagramContext.Provider value={{
      connections,
      loading,
      getConnection: (clientId) => connections.find(c => c.clientId === clientId),
      saveConnection,
      disconnectClient,
    }}>
      {children}
    </InstagramContext.Provider>
  )
}

export function useInstagram() {
  const ctx = useContext(InstagramContext)
  if (!ctx) throw new Error('useInstagram must be used within InstagramProvider')
  return ctx
}
