// Vercel serverless function — proxies image generation to HuggingFace
// Runs server-side so there are no browser CORS restrictions
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.VITE_HUGGING_FACE_API_KEY
  if (!token) {
    return res.status(500).json({ error: 'HF token not configured on server' })
  }

  const { prompt, model } = req.body ?? {}
  if (!prompt || !model) {
    return res.status(400).json({ error: 'prompt and model are required' })
  }

  let hfRes
  try {
    hfRes = await fetch(
      `https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-wait-for-model': 'true',
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    )
  } catch (err) {
    return res.status(502).json({ error: `HF request failed: ${err.message}` })
  }

  if (!hfRes.ok) {
    const text = await hfRes.text().catch(() => hfRes.statusText)
    return res.status(hfRes.status).json({ error: text })
  }

  const contentType = hfRes.headers.get('content-type') || 'image/png'
  const buffer = Buffer.from(await hfRes.arrayBuffer())
  res.setHeader('Content-Type', contentType)
  res.setHeader('Cache-Control', 'no-store')
  return res.status(200).send(buffer)
}
