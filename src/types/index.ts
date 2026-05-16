export type ModuleId = 'home' | 'calendar' | 'clients' | 'health' | 'projects' | 'quick'

// Simple event used in dashboard quick-view
export interface QuickEvent {
  id: string
  title: string
  date: string
  time: string
  color: string
}

export type EventCategory = 'personal' | 'client' | 'health' | 'project'

// Full calendar event
export interface CalendarEvent {
  id: string
  title: string
  date: string        // YYYY-MM-DD
  startTime: string   // HH:MM  (ignored when allDay)
  endTime: string     // HH:MM  (ignored when allDay)
  category: EventCategory
  description?: string
  zoomLink?: string
  location?: string
  allDay?: boolean
}

export interface Client {
  id: string
  name: string
  platform: string
  status: 'pending' | 'active' | 'paused' | 'rejected'
  avatar: string
  email?: string
  phone?: string
  notes?: string
  createdAt: string
}

export interface Script {
  id: string
  title: string
  platform: string
  type: 'caption' | 'script' | 'story'
  status: 'draft' | 'ready' | 'sent'
  content: string
  createdAt: string
}

export interface VideoContent {
  id: string
  title: string
  type: 'reel' | 'tiktok' | 'short' | 'story' | 'regular'
  status: 'idea' | 'filming' | 'editing' | 'ready' | 'published'
  notes: string
  duration?: string
  createdAt: string
}

export interface ClientFile {
  id: string
  name: string
  fileType: 'pdf' | 'image' | 'doc' | 'other'
  size: string
  uploadedAt: string
}

export interface ScheduledPost {
  id: string
  title: string
  platform: string
  date: string
  time: string
  status: 'planned' | 'ready' | 'published'
  type: 'image' | 'video' | 'reel' | 'story'
}

export interface ClientDetail extends Client {
  scripts: Script[]
  videos: VideoContent[]
  files: ClientFile[]
  posts: ScheduledPost[]
}

export interface Task {
  id: string
  title: string
  module: ModuleId
  done: boolean
  priority: 'high' | 'medium' | 'low'
}

export interface Notification {
  id: string
  text: string
  time: string
  type: 'info' | 'warning' | 'success'
  read: boolean
}

export interface HealthData {
  calories: { current: number; goal: number }
  water: { current: number; goal: number }
  steps: { current: number; goal: number }
}
