// Shared Instagram Graph API publishing logic — used by api/instagram-publish.js
// and the scheduled cron endpoint api/cron/publish-due-posts.js
const GRAPH = 'https://graph.facebook.com/v21.0'

const MEDIA_TYPE_BY_CONTENT_TYPE = {
  reel: 'REELS',
  story: 'STORIES',
}

// Publishes a single piece of content to an Instagram Business account.
// Returns { id } on success, throws Error with a user-readable message on failure.
export async function publishToInstagram({ igUserId, accessToken, caption, mediaUrl, contentType }) {
  if (!igUserId || !accessToken) throw new Error('חסר חיבור תקף לאינסטגרם')
  if (!mediaUrl) throw new Error('לפוסט הזה אין קובץ מדיה מצורף')

  const isVideo = /\.(mp4|mov|m4v)(\?|$)/i.test(mediaUrl)
  const containerBody = { caption: caption ?? '' }
  if (isVideo) {
    containerBody.video_url = mediaUrl
    containerBody.media_type = MEDIA_TYPE_BY_CONTENT_TYPE[contentType] ?? 'REELS'
  } else {
    containerBody.image_url = mediaUrl
  }

  const container = await postForm(`${GRAPH}/${igUserId}/media`, { ...containerBody, access_token: accessToken })
  if (container.error) throw new Error(container.error.message)
  if (!container.id) throw new Error('יצירת קונטיינר המדיה נכשלה')

  const published = await postForm(`${GRAPH}/${igUserId}/media_publish`, {
    creation_id: container.id, access_token: accessToken,
  })
  if (published.error) throw new Error(published.error.message)

  return { id: published.id }
}

async function postForm(url, body) {
  const r = await fetch(url, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    new URLSearchParams(body),
  })
  return r.json()
}
