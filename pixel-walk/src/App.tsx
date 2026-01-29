import './App.css'
import { useEffect, useMemo, useState } from 'react'
import Scene from './components/Scene'
import type { CharactersData, SpriteMeta } from './types'

function App() {
  const [data, setData] = useState<CharactersData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    fetch('/assets/characters/characters.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json: CharactersData) => {
        if (alive) setData(json)
      })
      .catch((err) => {
        if (alive) setError(`Failed to load sprite metadata: ${err.message}`)
      })
    return () => {
      alive = false
    }
  }, [])

  const characters = useMemo(() => {
    if (!data?.characters?.length) return []
    return data.characters
  }, [data])

  const left = characters[0] as SpriteMeta | undefined
  const right = characters[1] as SpriteMeta | undefined

  return (
    <div className="app">
      <header className="app-header">
        <p className="eyebrow">Pixel Walk MVP</p>
        <h1>Chibi Stroll</h1>
        <p className="subhead">
          Drop PNG sprite sheets into <code>public/assets/characters</code> and
          update <code>characters.json</code> to swap the walkers.
        </p>
      </header>

      <section className="scene-shell">
        {error && <div className="notice error">{error}</div>}
        {!error && (!left || !right) && (
          <div className="notice">
            Add at least two characters in
            <code>public/assets/characters/characters.json</code>.
          </div>
        )}
        {left && right && <Scene left={left} right={right} />}
      </section>

      <footer className="app-footer">
        <span>Pixel-perfect scaling · CSS steps() animation · No canvas</span>
      </footer>
    </div>
  )
}

export default App
