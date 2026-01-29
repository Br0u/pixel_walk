import type { CSSProperties } from 'react'
import type { SpriteMeta } from '../types'

type SpriteProps = {
  meta: SpriteMeta
  label?: string
  className?: string
}

function clampInt(value: number, min: number) {
  return Math.max(min, Math.floor(value))
}

export default function Sprite({ meta, label, className }: SpriteProps) {
  const frameWidth = clampInt(meta.frameWidth, 1)
  const frameHeight = clampInt(meta.frameHeight, 1)
  const frameCount = clampInt(meta.frameCount, 1)
  const fps = clampInt(meta.fps, 1)
  const scale = clampInt(meta.scale ?? 3, 1)

  const travelX = frameWidth * (frameCount - 1) * -1
  const duration = frameCount / fps

  const styleVars: CSSProperties = {
    // Numeric CSS vars are used in calc() with px vars for pixel-perfect scaling.
    ['--frame-width' as string]: `${frameWidth}px`,
    ['--frame-height' as string]: `${frameHeight}px`,
    ['--frame-count' as string]: frameCount,
    ['--scale' as string]: scale,
    ['--travel-x' as string]: `${travelX}px`,
    ['--duration' as string]: `${duration}s`,
    ['--sheet' as string]: `url(${meta.sheet})`,
  }

  return (
    <div className={`sprite ${className ?? ''}`.trim()} aria-label={label ?? meta.name} role="img">
      <div className="sprite-sheet" style={styleVars} />
    </div>
  )
}
