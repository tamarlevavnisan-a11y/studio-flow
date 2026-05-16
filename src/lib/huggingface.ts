const HF_TOKEN = import.meta.env.VITE_HF_TOKEN
const MODEL    = 'black-forest-labs/FLUX.1-schnell'

export async function generateImage(prompt: string): Promise<string> {
  if (!HF_TOKEN) throw new Error('Hugging Face token not configured')

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${MODEL}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
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
