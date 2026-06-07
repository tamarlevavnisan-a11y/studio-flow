// Vercel serverless function — completes the Facebook Login OAuth flow for
// connecting a client's Instagram Business account.
// Runs server-side so the Meta App Secret never reaches the browser.
const GRAPH = 'https://graph.facebook.com/v21.0'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const appId     = process.env.VITE_META_APP_ID
  const appSecret = process.env.META_APP_SECRET
  if (!appId || !appSecret) {
    return res.status(500).json({ error: 'Meta app credentials not configured on server' })
  }

  const { code, redirectUri } = req.body ?? {}
  if (!code || !redirectUri) {
    return res.status(400).json({ error: 'code and redirectUri are required' })
  }

  try {
    // 1. Exchange the authorization code for a short-lived user access token
    const codeParams = new URLSearchParams({
      client_id: appId, client_secret: appSecret, redirect_uri: redirectUri, code,
    })
    const shortLived = await fetchJson(`${GRAPH}/oauth/access_token?${codeParams}`)
    if (shortLived.error) return res.status(400).json({ error: shortLived.error.message })

    // 2. Exchange it for a long-lived user access token (~60 days)
    const exchangeParams = new URLSearchParams({
      grant_type: 'fb_exchange_token', client_id: appId, client_secret: appSecret,
      fb_exchange_token: shortLived.access_token,
    })
    const longLived = await fetchJson(`${GRAPH}/oauth/access_token?${exchangeParams}`)
    if (longLived.error) return res.status(400).json({ error: longLived.error.message })

    // 3. Find the user's Facebook Pages and their page access tokens
    const pagesParams = new URLSearchParams({ access_token: longLived.access_token })
    const pages = await fetchJson(`${GRAPH}/me/accounts?${pagesParams}`)
    if (pages.error) return res.status(400).json({ error: pages.error.message })
    if (!pages.data?.length) {
      return res.status(400).json({ error: 'לא נמצאו עמודי פייסבוק מחוברים לחשבון. ודאו שהעמוד מקושר לחשבון המשתמש.' })
    }

    // 4. Find the first Page with a linked Instagram Business account
    for (const page of pages.data) {
      const igParams = new URLSearchParams({
        fields: 'instagram_business_account{id,username}', access_token: page.access_token,
      })
      const pageInfo = await fetchJson(`${GRAPH}/${page.id}?${igParams}`)
      const igAccount = pageInfo.instagram_business_account
      if (igAccount) {
        return res.status(200).json({
          igUserId:    igAccount.id,
          igUsername:  igAccount.username,
          pageId:      page.id,
          accessToken: page.access_token,
          expiresAt:   longLived.expires_in
            ? new Date(Date.now() + longLived.expires_in * 1000).toISOString()
            : null,
        })
      }
    }

    return res.status(400).json({ error: 'לא נמצא חשבון אינסטגרם עסקי המקושר לאף אחד מעמודי הפייסבוק שלך.' })
  } catch (err) {
    return res.status(502).json({ error: `Meta request failed: ${err.message}` })
  }
}

async function fetchJson(url) {
  const r = await fetch(url)
  return r.json()
}
