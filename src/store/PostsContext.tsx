import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import type { ScheduledPost, PostStatus } from '../types'

interface PostsContextType {
  posts: ScheduledPost[]
  loading: boolean
  addPost: (data: Omit<ScheduledPost, 'id' | 'createdAt'>) => Promise<void>
  updatePost: (id: string, updates: Partial<Pick<ScheduledPost, 'status' | 'title' | 'content' | 'date' | 'time' | 'platform' | 'contentType'>>) => Promise<void>
  deletePost: (id: string) => Promise<void>
  uploadMedia: (file: File) => Promise<string | null>
}

const PostsContext = createContext<PostsContextType | null>(null)

function rowToPost(row: Record<string, unknown>): ScheduledPost {
  return {
    id:          row.id as string,
    clientId:    row.client_id as string,
    clientName:  row.client_name as string,
    title:       row.title as string,
    content:     (row.content as string) ?? '',
    contentType: row.content_type as ScheduledPost['contentType'],
    platform:    row.platform as ScheduledPost['platform'],
    date:        row.scheduled_date as string,
    time:        (row.scheduled_time as string).slice(0, 5),
    status:      row.status as PostStatus,
    mediaUrl:    row.media_url as string | undefined,
    createdAt:   row.created_at as string,
  }
}

export function PostsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [posts, setPosts]     = useState<ScheduledPost[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) { setPosts([]); return }
    load()
  }, [user?.id])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('scheduled_posts')
      .select('*')
      .order('scheduled_date', { ascending: true })
      .order('scheduled_time', { ascending: true })
    if (data) setPosts(data.map(rowToPost))
    setLoading(false)
  }

  async function addPost(data: Omit<ScheduledPost, 'id' | 'createdAt'>) {
    if (!user) return
    const { data: row, error } = await supabase
      .from('scheduled_posts')
      .insert({
        user_id:        user.id,
        client_id:      data.clientId,
        client_name:    data.clientName,
        title:          data.title,
        content:        data.content,
        content_type:   data.contentType,
        platform:       data.platform,
        scheduled_date: data.date,
        scheduled_time: data.time + ':00',
        status:         data.status,
        media_url:      data.mediaUrl ?? null,
      })
      .select()
      .single()
    if (!error && row) setPosts(ps => [...ps, rowToPost(row)])
  }

  async function updatePost(id: string, updates: Partial<Pick<ScheduledPost, 'status' | 'title' | 'content' | 'date' | 'time' | 'platform' | 'contentType'>>) {
    const dbMap: Record<string, unknown> = {}
    if (updates.status      !== undefined) dbMap.status         = updates.status
    if (updates.title       !== undefined) dbMap.title          = updates.title
    if (updates.content     !== undefined) dbMap.content        = updates.content
    if (updates.date        !== undefined) dbMap.scheduled_date = updates.date
    if (updates.time        !== undefined) dbMap.scheduled_time = updates.time + ':00'
    if (updates.platform    !== undefined) dbMap.platform       = updates.platform
    if (updates.contentType !== undefined) dbMap.content_type   = updates.contentType
    await supabase.from('scheduled_posts').update(dbMap).eq('id', id)
    setPosts(ps => ps.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  async function deletePost(id: string) {
    await supabase.from('scheduled_posts').delete().eq('id', id)
    setPosts(ps => ps.filter(p => p.id !== id))
  }

  async function uploadMedia(file: File): Promise<string | null> {
    if (!user) return null
    const ext  = file.name.split('.').pop() ?? 'bin'
    const path = `${user.id}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('post-media').upload(path, file)
    if (error) return null
    const { data } = supabase.storage.from('post-media').getPublicUrl(path)
    return data.publicUrl
  }

  return (
    <PostsContext.Provider value={{ posts, loading, addPost, updatePost, deletePost, uploadMedia }}>
      {children}
    </PostsContext.Provider>
  )
}

export function usePosts() {
  const ctx = useContext(PostsContext)
  if (!ctx) throw new Error('usePosts must be used within PostsProvider')
  return ctx
}
