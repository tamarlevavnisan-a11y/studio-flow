import { useRef, useState, useEffect, useCallback } from 'react'
import { Download, Upload, X, RefreshCw } from 'lucide-react'
import type { ClientDetail } from '../../types'

type Template = 'post' | 'story' | 'carousel'

const TEMPLATES: { id: Template; label: string; w: number; h: number }[] = [
  { id: 'post',     label: 'פוסט (1:1)',    w: 1080, h: 1080 },
  { id: 'story',    label: 'סטורי (9:16)',   w: 1080, h: 1920 },
  { id: 'carousel', label: 'קרוסלה',        w: 1080, h: 1080 },
]

const FONTS = ['Heebo', 'Assistant', 'Rubik', 'Frank Ruhl Libre']

interface Layer {
  title:    string
  subtitle: string
  tagline:  string
  showBrand: boolean
  clientName: string
  bgType:   'gradient' | 'solid'
  primaryColor: string
  secondaryColor: string
  textColor: string
  fontHeading: string
  titleSize: number
  subtitleSize: number
  imgSrc?: string
  imgOpacity: number
}

interface Props { client: ClientDetail }

export default function GraphicsTab({ client }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef    = useRef<HTMLImageElement | null>(null)
  const imgInputRef = useRef<HTMLInputElement>(null)

  const brand = client.brandProfile
  const [tmpl, setTmpl] = useState<Template>('post')
  const tplDef = TEMPLATES.find(t => t.id === tmpl)!

  const [layer, setLayer] = useState<Layer>({
    title:         client.name,
    subtitle:      brand?.marketingMessage ?? '',
    tagline:       '',
    showBrand:     true,
    clientName:    client.name,
    bgType:        'gradient',
    primaryColor:  brand?.primaryColor   ?? '#C4B5FD',
    secondaryColor:brand?.secondaryColor ?? '#F9A8D4',
    textColor:     '#FFFFFF',
    fontHeading:   brand?.fontHeading ?? 'Heebo',
    titleSize:     80,
    subtitleSize:  44,
    imgOpacity:    0.6,
  })

  const set = <K extends keyof Layer>(k: K, v: Layer[K]) =>
    setLayer(l => ({ ...l, [k]: v }))

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const { w, h } = tplDef

    canvas.width  = w
    canvas.height = h

    // Background
    if (layer.bgType === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, w, h)
      grad.addColorStop(0, layer.primaryColor)
      grad.addColorStop(1, layer.secondaryColor)
      ctx.fillStyle = grad
    } else {
      ctx.fillStyle = layer.primaryColor
    }
    ctx.fillRect(0, 0, w, h)

    // Image
    if (imgRef.current) {
      ctx.save()
      ctx.globalAlpha = layer.imgOpacity
      const img = imgRef.current
      const scale = Math.max(w / img.width, h / img.height)
      const sw = img.width * scale
      const sh = img.height * scale
      ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh)
      ctx.restore()
    }

    // Overlay for text legibility
    const overlay = ctx.createLinearGradient(0, h * 0.4, 0, h)
    overlay.addColorStop(0, 'rgba(0,0,0,0)')
    overlay.addColorStop(1, 'rgba(0,0,0,0.55)')
    ctx.fillStyle = overlay
    ctx.fillRect(0, 0, w, h)

    ctx.direction  = 'rtl'
    ctx.textAlign  = 'center'
    ctx.fillStyle  = layer.textColor

    // Title
    ctx.font = `bold ${layer.titleSize}px "${layer.fontHeading}", Heebo, sans-serif`
    const titleY = tmpl === 'story' ? h * 0.72 : h * 0.62
    wrapText(ctx, layer.title, w / 2, titleY, w * 0.85, layer.titleSize * 1.3)

    // Subtitle
    if (layer.subtitle) {
      ctx.font = `${layer.subtitleSize}px "${layer.fontHeading}", Heebo, sans-serif`
      ctx.globalAlpha = 0.88
      const subY = tmpl === 'story' ? h * 0.83 : h * 0.77
      wrapText(ctx, layer.subtitle, w / 2, subY, w * 0.8, layer.subtitleSize * 1.3)
      ctx.globalAlpha = 1
    }

    // Tagline
    if (layer.tagline) {
      ctx.font = `500 ${layer.subtitleSize - 8}px "${layer.fontHeading}", Heebo, sans-serif`
      ctx.globalAlpha = 0.75
      const tagY = tmpl === 'story' ? h * 0.91 : h * 0.88
      ctx.fillText(layer.tagline, w / 2, tagY)
      ctx.globalAlpha = 1
    }

    // Brand watermark
    if (layer.showBrand) {
      ctx.font = `600 32px "${layer.fontHeading}", Heebo, sans-serif`
      ctx.globalAlpha = 0.6
      ctx.fillText(layer.clientName, w / 2, h - 48)
      ctx.globalAlpha = 1
    }
  }, [layer, tplDef, tmpl])

  useEffect(() => { draw() }, [draw])

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { imgRef.current = img; set('imgSrc', url); draw() }
    img.src = url
  }

  function removeImage() {
    imgRef.current = null
    set('imgSrc', undefined)
    if (imgInputRef.current) imgInputRef.current.value = ''
  }

  function download() {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `${client.name}-${tmpl}-${Date.now()}.png`
    a.click()
  }

  const previewScale = tmpl === 'story' ? 0.28 : 0.42
  const previewW = Math.round(tplDef.w * previewScale)
  const previewH = Math.round(tplDef.h * previewScale)

  const inp = `w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 bg-white`

  return (
    <div className="flex gap-6" dir="rtl">
      {/* Controls */}
      <div className="flex-1 space-y-4 overflow-y-auto max-h-[620px] pl-2">

        {/* Template */}
        <div>
          <p className="text-xs font-700 text-gray-500 mb-2">תבנית</p>
          <div className="flex gap-2">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => setTmpl(t.id)}
                className={`flex-1 py-2 rounded-xl text-xs font-600 border transition-all ${
                  tmpl === t.id ? 'bg-violet-500 text-white border-transparent' : 'bg-white border-gray-200 text-gray-500'
                }`}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* Background */}
        <div>
          <p className="text-xs font-700 text-gray-500 mb-2">רקע</p>
          <div className="flex gap-2 mb-3">
            {(['gradient', 'solid'] as const).map(bt => (
              <button key={bt} onClick={() => set('bgType', bt)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-600 border transition-all ${
                  layer.bgType === bt ? 'bg-gray-800 text-white border-transparent' : 'bg-white border-gray-200 text-gray-500'
                }`}>{bt === 'gradient' ? 'גרדיאנט' : 'אחיד'}</button>
            ))}
          </div>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 text-xs text-gray-500 flex-1">
              <input type="color" value={layer.primaryColor} onChange={e => set('primaryColor', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200 p-0.5" />
              ראשי
            </label>
            {layer.bgType === 'gradient' && (
              <label className="flex items-center gap-2 text-xs text-gray-500 flex-1">
                <input type="color" value={layer.secondaryColor} onChange={e => set('secondaryColor', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200 p-0.5" />
                משני
              </label>
            )}
            <label className="flex items-center gap-2 text-xs text-gray-500 flex-1">
              <input type="color" value={layer.textColor} onChange={e => set('textColor', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200 p-0.5" />
              טקסט
            </label>
          </div>
        </div>

        {/* Image */}
        <div>
          <p className="text-xs font-700 text-gray-500 mb-2">תמונת רקע / מוצר</p>
          {layer.imgSrc ? (
            <div className="flex items-center gap-3">
              <img src={layer.imgSrc} alt="" className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">שקיפות</p>
                <input type="range" min={0.1} max={1} step={0.05} value={layer.imgOpacity}
                  onChange={e => set('imgOpacity', parseFloat(e.target.value))}
                  className="w-full" />
              </div>
              <button onClick={removeImage} className="text-gray-400 hover:text-red-400">
                <X size={14} />
              </button>
            </div>
          ) : (
            <button onClick={() => imgInputRef.current?.click()}
              className="flex items-center gap-2 w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-xs text-gray-400 hover:border-violet-300 hover:text-violet-500 transition-all justify-center">
              <Upload size={13} /> העלי תמונה
            </button>
          )}
          <input ref={imgInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>

        {/* Text layers */}
        <div className="space-y-3">
          <p className="text-xs font-700 text-gray-500">טקסט</p>
          <div>
            <label className="text-[10px] text-gray-400 block mb-1">כותרת ראשית</label>
            <input value={layer.title} onChange={e => set('title', e.target.value)} className={inp} />
            <input type="range" min={40} max={140} value={layer.titleSize} onChange={e => set('titleSize', +e.target.value)} className="w-full mt-1" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 block mb-1">תת-כותרת</label>
            <input value={layer.subtitle} onChange={e => set('subtitle', e.target.value)} className={inp} placeholder="תת-כותרת אופציונלית" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 block mb-1">טאגליין / האשטג</label>
            <input value={layer.tagline} onChange={e => set('tagline', e.target.value)} className={inp} placeholder="#האשטג או סלוגן" />
          </div>
        </div>

        {/* Font */}
        <div>
          <label className="text-xs font-700 text-gray-500 block mb-1.5">פונט</label>
          <select value={layer.fontHeading} onChange={e => set('fontHeading', e.target.value)} className={inp}>
            {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* Brand name */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={layer.showBrand} onChange={e => set('showBrand', e.target.checked)} className="w-4 h-4 rounded accent-violet-500" />
          <span className="text-sm text-gray-600">הצגת שם הלקוח</span>
        </label>

        {/* Refresh + Download */}
        <div className="flex gap-2 pt-2">
          <button onClick={draw}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <RefreshCw size={14} /> רענן
          </button>
          <button onClick={download}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-600 transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${layer.primaryColor}, ${layer.secondaryColor})` }}>
            <Download size={14} /> הורד PNG
          </button>
        </div>
      </div>

      {/* Canvas preview */}
      <div className="flex-shrink-0 flex flex-col items-center gap-2">
        <p className="text-xs text-gray-400 font-500">{tplDef.w} × {tplDef.h}px</p>
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100"
          style={{ width: previewW, height: previewH }}>
          <canvas ref={canvasRef}
            style={{ width: previewW, height: previewH, display: 'block' }} />
        </div>
      </div>
    </div>
  )
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number) {
  const words = text.split(' ')
  let line  = ''
  let curY  = y
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, curY)
      line = word
      curY += lineH
    } else {
      line = test
    }
  }
  ctx.fillText(line, x, curY)
}
