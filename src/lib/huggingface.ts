import { HfInference } from '@huggingface/inference'
import type { BrandProfile } from '../types'

const IMAGE_MODEL = 'black-forest-labs/FLUX.1-schnell'
const TEXT_MODEL  = 'mistralai/Mistral-7B-Instruct-v0.3'

function getHf(): HfInference {
  const k = import.meta.env.VITE_HUGGING_FACE_API_KEY
  if (!k) throw new Error('הוסיפי VITE_HUGGING_FACE_API_KEY ב-.env.local ואתחלי את השרת')
  return new HfInference(k)
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
  const hf  = getHf()
  const blob = await hf.textToImage({
    model:  IMAGE_MODEL,
    inputs: prompt,
  })
  return URL.createObjectURL(blob)
}

// ── Text streaming ─────────────────────────────────────────────────────────

export async function streamText(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  onChunk: (text: string) => void
): Promise<void> {
  const hf     = getHf()
  const stream = hf.chatCompletionStream({
    model:      TEXT_MODEL,
    messages:   [{ role: 'system', content: systemPrompt }, ...messages],
    max_tokens: 900,
    temperature: 0.75,
  })
  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content ?? ''
    if (text) onChunk(text)
  }
}

// ── Text generation (non-streaming) ───────────────────────────────────────

export async function generateText(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const hf  = getHf()
  const res = await hf.chatCompletion({
    model:      TEXT_MODEL,
    messages:   [{ role: 'system', content: systemPrompt }, ...messages],
    max_tokens: 900,
    temperature: 0.75,
  })
  return res.choices[0]?.message?.content ?? ''
}
