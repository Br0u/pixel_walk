export type SpriteMeta = {
  id: string
  name: string
  sheet: string
  frameWidth: number
  frameHeight: number
  frameCount: number
  fps: number
  scale?: number
}

export type CharactersData = {
  characters: SpriteMeta[]
}
