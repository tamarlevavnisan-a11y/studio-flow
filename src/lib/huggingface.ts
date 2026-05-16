const HF_KEY      = import.meta.env.VITE_HUGGING_FACE_API_KEY
const IMAGE_MODEL = 'black-forest-labs/FLUX.1-schnell'
const TEXT_MODEL  = 'mistralai/Mistral-7B-Instruct-v0.3'
const CHAT_API    = `https://api-inference.huggingface.co/models/${TEXT_MODEL}/v1/chat/completions`

export const hasHfKey = () => !!HF_KEY

export async function generateImage(prompt: string): Promise<string> {
  if (!HF_KEY) throw new Error('Hugging Face API key not configured')

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${IMAGE_MODEL}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    }
  )

  if (!response.ok) {
    const err = await response.text().catch(() => response.statusText)
    throw new Error(err)
  }

  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

export async function streamText(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  onChunk: (text: string) => void
): Promise<void> {
  if (!HF_KEY) throw new Error('Hugging Face API key not configured')

  const response = await fetch(CHAT_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: TEXT_MODEL,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      max_tokens: 900,
      temperature: 0.75,
      stream: true,
    }),
  })

  if (!response.ok) {
    const err = await response.text().catch(() => response.statusText)
    throw new Error(err)
  }

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

export async function generateText(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  if (!HF_KEY) throw new Error('Hugging Face API key not configured')

  const response = await fetch(CHAT_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: TEXT_MODEL,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      max_tokens: 900,
      temperature: 0.75,
    }),
  })

  if (!response.ok) {
    const err = await response.text().catch(() => response.statusText)
    throw new Error(err)
  }

  const data = await response.json()
  return (data.choices?.[0]?.message?.content ?? '') as string
}
