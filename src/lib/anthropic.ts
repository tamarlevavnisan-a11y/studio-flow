import Anthropic from '@anthropic-ai/sdk'
import type { BrandProfile } from '../types'

export const anthropic = import.meta.env.VITE_ANTHROPIC_KEY
  ? new Anthropic({ apiKey: import.meta.env.VITE_ANTHROPIC_KEY, dangerouslyAllowBrowser: true })
  : null

export function buildSystemPrompt(
  clientName: string,
  platform: string,
  brand?: BrandProfile
): string {
  return `אתה עוזרת AI מומחית למנהלת מדיה חברתית ישראלית.
את עוזרת לה ליצור תוכן ללקוח "${clientName}" בפלטפורמת ${platform}.
${brand ? `
פרופיל המותג:
• סגנון כתיבה: ${brand.writingStyle || '—'}
• קהל יעד: ${brand.targetAudience || '—'}
• מסר שיווקי: ${brand.marketingMessage || '—'}
• טון: ${{ professional: 'מקצועי', casual: 'קזואל', fun: 'כיפי', inspiring: 'מעורר השראה', luxury: 'יוקרתי' }[brand.tone] ?? brand.tone}
• מילות מפתח: ${brand.keywords?.join(', ') || '—'}
` : '(פרופיל מותג לא הוגדר עדיין)'}
כתבי תמיד בעברית. התאמי את הסגנון בדיוק לפרופיל.`
}

export async function streamChat(
  messages: { role: 'user' | 'assistant'; content: string }[],
  system: string,
  onChunk: (text: string) => void
): Promise<void> {
  if (!anthropic) throw new Error('Anthropic key not configured')
  const stream = await anthropic.messages.stream({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    system,
    messages,
  })
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      onChunk(chunk.delta.text)
    }
  }
}
