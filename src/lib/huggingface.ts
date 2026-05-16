import type { BrandProfile } from '../types'

const IMAGE_MODEL = 'black-forest-labs/FLUX.1-schnell'
const TEXT_MODEL  = 'mistralai/Mistral-7B-Instruct-v0.3'

// In dev Vite proxies /hf-api/* → api-inference.huggingface.co (no CORS).
// In prod the browser calls /api/hf-image (Vercel serverless, no CORS)
// or the chat endpoint directly (HF supports CORS for that endpoint).
const HF_DIRECT = 'https://api-inference.huggingface.co'
const HF_DEV    = '/hf-api'       // proxied by Vite in dev
const CHAT_BASE = import.meta.env.DEV ? HF_DEV : HF_DIRECT
const CHAT_API  = `${CHAT_BASE}/models/${TEXT_MODEL}/v1/chat/completions`

function getKey(): string {
  const k = import.meta.env.VITE_HUGGING_FACE_API_KEY
  if (!k) throw new Error('הוסיפי VITE_HUGGING_FACE_API_KEY ב-.env.local ואתחלי את השרת מחדש')
  return k
}

// ── Brand prompt builder ───────────────────────────────────────────────────

const TONE_EN: Record<BrandProfile['tone'], string> = {
  professional: 'professional',
  casual:       'casual and friendly',
  fun:          'fun and energetic',
  inspiring:    'inspiring and motivational',
  luxury:       'luxurious and sophisticated',
}

export function buildSystemPrompt(clientName: string, platform: string, brand?: BrandProfile): string {
  return `You are an expert social media content creator for an Israeli social media manager.
Create content for the client "${clientName}" on ${platform}.
${brand ? `Brand profile:
- Writing style: ${brand.writingStyle || 'authentic and engaging'}
- Target audience: ${brand.targetAudience || 'general audience'}
- Marketing message: ${brand.marketingMessage || ''}
- Tone: ${TONE_EN[brand.tone] ?? brand.tone}
- Keywords: ${brand.keywords?.join(', ') || ''}` : '(No brand profile set yet)'}
Always write in Hebrew (עברית). Match the exact brand tone. Use emojis naturally.`
}

// ── Image generation ───────────────────────────────────────────────────────

export async function generateImage(prompt: string): Promise<string> {
  const key = getKey()

  let response: Response

  if (import.meta.env.DEV) {
    // Dev: go through Vite proxy → HF API (no CORS)
    response = await fetch(`${HF_DEV}/models/${IMAGE_MODEL}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt }),
    })
    if (!response.ok) {
      const err = await response.text().catch(() => response.statusText)
      throw new Error(err)
    }
  } else {
    // Prod: Vercel serverless function (no CORS, key stays server-side)
    response = await fetch('/api/hf-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model: IMAGE_MODEL }),
    })
    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(typeof err === 'object' ? err.error : String(err))
    }
  }

  return URL.createObjectURL(await response.blob())
}

// ── Text streaming ─────────────────────────────────────────────────────────

export async function streamText(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  onChunk: (text: string) => void
): Promise<void> {
  const key = getKey()
  const response = await fetch(CHAT_API, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: TEXT_MODEL,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      max_tokens: 900,
      temperature: 0.75,
      stream: true,
    }),
  })
  if (!response.ok) throw new Error(await response.text().catch(() => response.statusText))

  const reader  = response.body?.getReader()
  if (!reader) return
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const raw = decoder.decode(value, { stream: true })
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data: ')) continue
      const payload = trimmed.slice(6)
      if (payload === '[DONE]') return
      try {
        const delta = JSON.parse(payload).choices?.[0]?.delta?.content ?? ''
        if (delta) onChunk(delta)
      } catch {}
    }
  }
}

// ── Text generation (non-streaming) ───────────────────────────────────────

export async function generateText(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const key = getKey()
  const response = await fetch(CHAT_API, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: TEXT_MODEL,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      max_tokens: 900,
      temperature: 0.75,
    }),
  })
  if (!response.ok) throw new Error(await response.text().catch(() => response.statusText))
  const data = await response.json()
  return (data.choices?.[0]?.message?.content ?? '') as string
}
