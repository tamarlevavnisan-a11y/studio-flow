// Vercel serverless — fetches the real Instagram media for a connected account
const GRAPH = 'https://graph.facebook.com/v21.0'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { igUserId, accessToken } = req.query
  if (!igUserId || !accessToken) {
    return res.status(400).json({ error: 'igUserId and accessToken are required' })
  }

  try {
    const params = new URLSearchParams({
      fields: 'id,caption,media_url,thumbnail_url,media_type,timestamp,permalink,like_count,comments_count',
      access_token: accessToken,
      limit: '24',
    })
    const data = await fetchJson(`${GRAPH}/${igUserId}/media?${params}`)
    if (data.error) return res.status(400).json({ error: data.error.message })
    return res.status(200).json({ posts: data.data ?? [] })
  } catch (err) {
    return res.status(502).json({ error: `Instagram API error: ${err.message}` })
  }
}

async function fetchJson(url) {
  const r = await fetch(url)
  return r.json()
}
