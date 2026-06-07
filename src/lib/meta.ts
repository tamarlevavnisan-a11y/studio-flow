// Helpers for the Facebook Login (Meta Graph API) OAuth flow used to connect
// a client's Instagram Business account.

export const META_APP_ID = import.meta.env.VITE_META_APP_ID as string | undefined

export const META_GRAPH_VERSION = 'v21.0'

const META_OAUTH_SCOPES = [
  'instagram_basic',
  'instagram_content_publish',
  'pages_show_list',
  'pages_read_engagement',
]

export function instagramRedirectUri() {
  return `${window.location.origin}/instagram/callback`
}

// Builds the Facebook Login dialog URL. `state` carries the clientId through
// the redirect so the callback page knows which client to attach the connection to.
export function instagramLoginUrl(clientId: string) {
  const params = new URLSearchParams({
    client_id:     META_APP_ID ?? '',
    redirect_uri:  instagramRedirectUri(),
    scope:         META_OAUTH_SCOPES.join(','),
    response_type: 'code',
    state:         clientId,
  })
  return `https://www.facebook.com/${META_GRAPH_VERSION}/dialog/oauth?${params.toString()}`
}
