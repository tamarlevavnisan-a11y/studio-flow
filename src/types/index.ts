export type ModuleId = 'home' | 'calendar' | 'clients' | 'health' | 'projects' | 'quick'

// ── Nutrition ─────────────────────────────────────────────────────────────
export interface FoodItem {
  id: string
  name: string
  unitLabel: string  // e.g. '100g', 'יחידה', 'כוס (240ml)'
  calories: number   // per one unit
  protein: number
  carbs: number
  fat: number
}

export interface LoggedFoodItem {
  foodId: string
  foodName: string
  unitLabel: string
  quantity: number   // multiplier (0.5, 1, 1.5, 2 …)
  calories: number   // = food.calories * quantity
  protein: number
  carbs: number
  fat: number
}

export interface MealEntry {
  id: string
  date: string       // YYYY-MM-DD
  time: string       // HH:MM
  name: string       // 'ארוחת בוקר' / 'ארוחת צהריים' / etc.
  items: LoggedFoodItem[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}

export interface SavedMeal {
  id: string
  name: string
  items: LoggedFoodItem[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}

export interface NutritionGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

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

export type PostContentType = 'post' | 'reel' | 'story' | 'carousel'
export type PostPlatform    = 'Instagram' | 'TikTok' | 'Facebook'
export type PostStatus      = 'pending' | 'published' | 'failed'

export interface ScheduledPost {
  id: string
  clientId: string
  clientName: string
  title: string
  content: string
  contentType: PostContentType
  platform: PostPlatform    // primary platform (platforms[0]) — kept for compat
  platforms: PostPlatform[] // all selected platforms
  date: string      // YYYY-MM-DD
  time: string      // HH:MM
  status: PostStatus
  mediaUrl?: string
  createdAt: string
}

export interface InstagramConnection {
  id:             string
  clientId:       string
  igUserId:       string
  igUsername:     string
  pageId:         string
  accessToken:    string
  tokenExpiresAt?: string
  createdAt:      string
}

export interface BrandProfile {
  primaryColor:     string   // hex e.g. '#F472B6'
  secondaryColor:   string
  fontHeading:      'Heebo' | 'Assistant' | 'Rubik' | 'Frank Ruhl Libre'
  fontBody:         'Heebo' | 'Assistant' | 'Rubik' | 'Frank Ruhl Libre'
  writingStyle:     string
  marketingMessage: string
  targetAudience:   string
  tone:             'professional' | 'casual' | 'fun' | 'inspiring' | 'luxury'
  keywords:         string[]
}

export interface ClientDetail extends Client {
  scripts:      Script[]
  videos:       VideoContent[]
  files:        ClientFile[]
  brandProfile?: BrandProfile
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
