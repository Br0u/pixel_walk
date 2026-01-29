import type { CSSProperties } from 'react'
import type { AnimationClip, SpriteMeta } from '../types'

type SpriteProps = {
  meta: SpriteMeta
  clip: AnimationClip
  playing?: boolean
  flipX?: boolean
  className?: string
}

function clampInt(value: number, min: number) {
  return Math.max(min, Math.floor(value))
}

export default function Sprite({ meta, clip, playing = true, flipX, className }: SpriteProps) {
  const frameWidth = clampInt(meta.frameWidth, 1)
  const frameHeight = clampInt(meta.frameHeight, 1)
  const frameCount = clampInt(clip.frames, 1)
  const fps = clampInt(clip.fps, 1)
  const scale = clampInt(meta.scale ?? 6, 1)
  const row = clampInt(clip.row, 0)

  const travelX = frameWidth * (frameCount - 1) * -scale
  const duration = frameCount / fps

  const styleVars: CSSProperties = {
    // Numeric CSS vars are used in calc() with px vars for pixel-perfect scaling.
    ['--frame-width' as string]: `${frameWidth}px`,
    ['--frame-height' as string]: `${frameHeight}px`,
    ['--frame-count' as string]: frameCount,
    ['--row' as string]: row,
    ['--rows' as string]: meta.rows,
    ['--row-offset' as string]: `${row * frameHeight * scale * -1}px`,
    ['--scale' as string]: scale,
    ['--travel-x' as string]: `${travelX}px`,
    ['--duration' as string]: `${duration}s`,
    ['--sheet' as string]: `url(${meta.sheet})`,
    ['--loop-count' as string]: clip.loop ? 'infinite' : '1',
    animationPlayState: playing ? 'running' : 'paused',
  }

  return (
    <div
      className={`sprite ${flipX ? 'flip-x' : ''} ${className ?? ''}`.trim()}
      aria-label={meta.name}
      role="img"
    >
      <div className="sprite-sheet" style={styleVars} />
    </div>
  )
}
