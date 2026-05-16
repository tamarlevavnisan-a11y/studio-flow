import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL     = 'https://mlwkdthlwundodsxjbdg.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_g_9_WW1f-ScFfVVaZO5TIQ_3g1AFHxC'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const ADMIN_EMAIL = 'tamarlev.avnisan@gmail.com'
