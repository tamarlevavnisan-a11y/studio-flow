// Vercel serverless function — publishes a single scheduled post to Instagram
// on demand. Called server-to-server only (the access token never reaches the
// browser); the cron endpoint reuses the same publishing logic.
import { publishToInstagram } from './_lib/instagramPublish.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { igUserId, accessToken, caption, mediaUrl, contentType } = req.body ?? {}
  try {
    const result = await publishToInstagram({ igUserId, accessToken, caption, mediaUrl, contentType })
    return res.status(200).json(result)
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}
