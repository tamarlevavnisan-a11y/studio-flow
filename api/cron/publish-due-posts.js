// Vercel serverless function — finds scheduled Instagram posts whose time has
// arrived and publishes them via the Graph API. Triggered by an external
// scheduler (Vercel's free Cron only runs daily) hitting this URL every few
// minutes with `Authorization: Bearer <CRON_SECRET>`.
import { createClient } from '@supabase/supabase-js'
import { publishToInstagram } from '../_lib/instagramPublish.js'

const SUPABASE_URL = 'https://mlwkdthlwundodsxjbdg.supabase.co'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const cronSecret = process.env.CRON_SECRET
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!cronSecret || !serviceKey) {
    return res.status(500).json({ error: 'Cron credentials not configured on server' })
  }
  if (req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const supabase = createClient(SUPABASE_URL, serviceKey)
  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  const time  = now.toISOString().slice(11, 19)

  // Posts that are due: scheduled for today at/before the current time, or any earlier date
  // `platform` column stores either plain "Instagram" or JSON '["Instagram","TikTok"]'
  const { data: posts, error: postsError } = await supabase
    .from('scheduled_posts')
    .select('*')
    .eq('status', 'pending')
    .like('platform', '%Instagram%')
    .or(`scheduled_date.lt.${today},and(scheduled_date.eq.${today},scheduled_time.lte.${time})`)

  if (postsError) return res.status(500).json({ error: postsError.message })
  if (!posts?.length) return res.status(200).json({ published: 0, failed: 0 })

  let published = 0
  let failed = 0

  for (const post of posts) {
    const { data: connection } = await supabase
      .from('instagram_connections')
      .select('*')
      .eq('user_id', post.user_id)
      .eq('client_id', post.client_id)
      .maybeSingle()

    if (!connection) {
      failed++
      await supabase.from('scheduled_posts').update({ status: 'failed' }).eq('id', post.id)
      continue
    }

    try {
      await publishToInstagram({
        igUserId:    connection.ig_user_id,
        accessToken: connection.access_token,
        caption:     post.content,
        mediaUrl:    post.media_url,
        contentType: post.content_type,
      })
      published++
      await supabase.from('scheduled_posts').update({ status: 'published' }).eq('id', post.id)
    } catch {
      failed++
      await supabase.from('scheduled_posts').update({ status: 'failed' }).eq('id', post.id)
    }
  }

  return res.status(200).json({ published, failed })
}
