import { useEffect, useMemo, useState } from 'react'
import type { SpriteMeta } from '../types'
import Sprite from './Sprite'

type SceneProps = {
  left: SpriteMeta
  right: SpriteMeta
  gap?: number
  speed?: number
}

function clampInt(value: number, min: number) {
  return Math.max(min, Math.floor(value))
}

export default function Scene({ left, right, gap = 12, speed = 80 }: SceneProps) {
  const [duration, setDuration] = useState(12)

  const pairWidth = useMemo(() => {
    const leftScale = clampInt(left.scale ?? 3, 1)
    const rightScale = clampInt(right.scale ?? 3, 1)
    const leftWidth = clampInt(left.frameWidth, 1) * leftScale
    const rightWidth = clampInt(right.frameWidth, 1) * rightScale
    return leftWidth + rightWidth + gap
  }, [gap, left, right])

  useEffect(() => {
    const updateDuration = () => {
      const distance = pairWidth + window.innerWidth
      const seconds = distance / Math.max(30, speed)
      setDuration(Math.max(6, Math.round(seconds)))
    }
    updateDuration()
    window.addEventListener('resize', updateDuration)
    return () => window.removeEventListener('resize', updateDuration)
  }, [pairWidth, speed])

  const styleVars = useMemo(
    () => ({
      ['--pair-width' as string]: `${pairWidth}px`,
      animationDuration: `${duration}s`,
    }),
    [duration, pairWidth],
  )

  return (
    <div className="scene">
      <div className="scene-sky" />
      <div className="scene-horizon" />
      <div className="scene-ground" />
      <div className="sprite-track">
        <div className="sprite-pair" style={styleVars}>
          <Sprite meta={left} className="sprite-left" />
          <div className="sprite-gap" style={{ width: gap }} />
          <Sprite meta={right} className="sprite-right" />
        </div>
      </div>
    </div>
  )
}
