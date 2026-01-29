export type AnimationClip = {
  row: number
  frames: number
  fps: number
  loop: boolean
}

export type SpriteConfig = {
  frameWidth: number
  frameHeight: number
  animations: Record<string, AnimationClip>
}

export type SpriteMeta = SpriteConfig & {
  name: string
  sheet: string
  scale?: number
  rows: number
}
