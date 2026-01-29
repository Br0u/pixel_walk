import './App.css'
import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import Scene from './components/Scene'
import { parseSubtitles, type LyricLine } from './lyrics'

type Act = 'establish' | 'vows' | 'before' | 'singing' | 'kiss' | 'celebration' | 'freeze'
type BlessingParticle = {
  id: number
  x: number
  y: number
  text: string
  size: number
  drift: number
  delay: number
}

const loadSubtitles = async (): Promise<LyricLine[]> => {
  const candidates = [
    '/lyrics/song.vtt',
    '/lyrics/song.srt',
    '/assets/song.vtt',
    '/assets/song.srt',
  ]
  for (const path of candidates) {
    const res = await fetch(path, { cache: 'no-cache' })
    if (res.ok) {
      const raw = await res.text()
      const lines = parseSubtitles(raw)
      if (lines.length) return lines
    }
  }
  return []
}

function App() {
  const [act, setAct] = useState<Act>('establish')
  const [buttonLabel, setButtonLabel] = useState('💍 结婚')
  const [songPlaying, setSongPlaying] = useState(false)
  const [lyrics, setLyrics] = useState<LyricLine[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [sealed, setSealed] = useState(true)
  const [blessingBursts, setBlessingBursts] = useState<BlessingParticle[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lyricRefs = useRef<Array<HTMLDivElement | null>>([])
  const burstIdRef = useRef(0)

  useEffect(() => {
    loadSubtitles().then(setLyrics).catch(() => setLyrics([]))
  }, [])

  useEffect(() => {
    if (act === 'establish') {
      const timer = window.setTimeout(() => setAct('vows'), 1400)
      return () => window.clearTimeout(timer)
    }
    if (act === 'vows') {
      const timer = window.setTimeout(() => setAct('before'), 1500)
      return () => window.clearTimeout(timer)
    }
    if (act === 'singing') {
      const timer = window.setTimeout(() => setAct('kiss'), 1800)
      return () => window.clearTimeout(timer)
    }
    if (act === 'kiss') {
      const timer = window.setTimeout(() => setAct('celebration'), 1800)
      return () => window.clearTimeout(timer)
    }
    if (act === 'celebration') {
      const timer = window.setTimeout(() => {
        setAct('freeze')
        setButtonLabel('🎉 再来一次')
      }, 3200)
      return () => window.clearTimeout(timer)
    }
    return
  }, [act])

  const handleCeremonyClick = () => {
    if (act === 'before') {
      setAct('singing')
    } else if (act === 'freeze') {
      setButtonLabel('💍 结婚')
      setAct('establish')
    }
  }

  const handlePlayPause = async () => {
    const audio = audioRef.current
    if (!audio) return
    try {
      if (audio.paused) {
        await audio.play()
        setSongPlaying(true)
      } else {
        audio.pause()
        setSongPlaying(false)
      }
    } catch {
      setSongPlaying(false)
    }
  }

  const handleSeek = (value: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value
    setCurrentTime(value)
  }

  const activeIndex = useMemo(() => {
    const ms = currentTime * 1000
    for (let i = 0; i < lyrics.length; i += 1) {
      const line = lyrics[i]
      if (ms >= line.startMs && ms <= line.endMs) return i
    }
    return -1
  }, [currentTime, lyrics])

  const reelActive = songPlaying && currentTime >= 28
  const reelFadeOut = currentTime >= 160
  const blessingActive = songPlaying && currentTime >= 169
  const blessingFadeOut = songPlaying && duration > 0 && currentTime >= Math.max(duration - 3, 0)

  useEffect(() => {
    if (activeIndex < 0) return
    const node = lyricRefs.current[activeIndex]
    node?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [activeIndex])

  const brideSprite = useMemo(
    () => ({
      name: '🍊',
      sheet: '/assets/female_front.png',
      frameWidth: 64,
      frameHeight: 64,
      rows: 1,
      scale: 4,
      animations: {
        idle: { row: 0, frames: 1, fps: 1, loop: true },
      },
    }),
    [],
  )

  const groomSprite = useMemo(
    () => ({
      name: 'sky',
      sheet: '/assets/male_front.png',
      frameWidth: 64,
      frameHeight: 64,
      rows: 1,
      scale: 4,
      animations: {
        idle: { row: 0, frames: 1, fps: 1, loop: true },
      },
    }),
    [],
  )

  const handleBlessingBurst = (event: PointerEvent<HTMLDivElement>) => {
    if (sealed) return
    const { clientX, clientY } = event
    const labels = ['吉祥', '祝福', '爱心', '囍', '❤']
    const burstId = burstIdRef.current + 1
    burstIdRef.current = burstId
    const newParticles: BlessingParticle[] = Array.from({ length: 14 }, (_, index) => {
      const spread = 80
      return {
        id: burstId * 100 + index,
        x: clientX + (Math.random() - 0.5) * spread,
        y: clientY + (Math.random() - 0.5) * spread,
        text: labels[index % labels.length],
        size: 12 + Math.random() * 8,
        drift: (Math.random() - 0.5) * 60,
        delay: Math.random() * 0.4,
      }
    })
    setBlessingBursts((prev) => [...prev, ...newParticles])
    window.setTimeout(() => {
      setBlessingBursts((prev) => prev.filter((item) => !newParticles.some((p) => p.id === item.id)))
    }, 1600)
  }

  return (
    <div className={`app ${sealed ? 'sealed' : 'opened'}`} onPointerDown={handleBlessingBurst}>
      <div className={`red-envelope ${sealed ? 'sealed' : 'open'}`} aria-hidden={!sealed}>
        <div className="seal-panel left" />
        <div className="seal-panel right" />
        <div className="seal-content">
          <div className="seal-title">良缘永结</div>
          <div className="seal-names">
            <span>陈瑞天</span>
            <span className="seal-heart">♥</span>
            <span>程于书</span>
          </div>
          <button type="button" className="seal-button" onClick={() => setSealed(false)}>
            点击开启
          </button>
          <div className="seal-sub">福满新堂 · 永结同心</div>
        </div>
      </div>
      <div className="click-particles" aria-hidden="true">
        {blessingBursts.map((particle) => (
          <span
            key={particle.id}
            className="blessing-particle"
            style={{
              left: particle.x,
              top: particle.y,
              fontSize: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              ['--drift' as const]: `${particle.drift}px`,
            }}
          >
            {particle.text}
          </span>
        ))}
      </div>
      <header className="ui-bar">
        <div className="audio-controls">
          <button type="button" className={`song-btn ${songPlaying ? 'active' : ''}`} onClick={handlePlayPause}>
            {songPlaying ? '⏸ 暂停' : '▶ 播放'}
          </button>
          <div className="seek-wrap">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(event) => handleSeek(Number(event.target.value))}
            />
          </div>
        </div>
      </header>
      <section className="scene-shell">
        <Scene
          act={act}
          songPlaying={songPlaying}
          reelActive={reelActive}
          reelFadeOut={reelFadeOut}
          blessingActive={blessingActive}
          blessingFadeOut={blessingFadeOut}
          bride={brideSprite}
          groom={groomSprite}
          guests={[
            { name: 'wbr', symbol: '🙌' },
            { name: 'wxt', symbol: '🎉' },
            { name: 'wyh', symbol: 'o/' },
            { name: 'yyn', symbol: '\\o' },
            { name: 'xml', symbol: '🎊' },
            { name: 'gq', symbol: '🙌' },
            { name: 'vanris', symbol: '🎉' },
            { name: 'ranco', symbol: '🎊' },
            { name: 'lin', symbol: '🥂' },
            { name: 'mei', symbol: '✨' },
            { name: 'hao', symbol: '🎈' },
            { name: 'kai', symbol: '🥳' },
            { name: 'yu', symbol: '😄' },
            { name: 'zhi', symbol: '🎵' },
            { name: 'qiu', symbol: '💐' },
            { name: 'sun', symbol: '🤩' },
          ]}
        />
        <div className="lyrics-dock">
          {songPlaying && (
            <div className="lyrics-list compact">
              {lyrics.length === 0 && <div className="lyrics-empty">尚未加载字幕文件</div>}
              {lyrics.map((line, index) => {
                const distance = Math.abs(index - activeIndex)
                const state =
                  activeIndex === index
                    ? 'active'
                    : distance === 1
                      ? 'near'
                      : distance === 2
                        ? 'next'
                        : 'blur'
                return (
                  <div
                    key={`${line.startMs}-${index}`}
                    ref={(node) => {
                      lyricRefs.current[index] = node
                    }}
                    className={`lyrics-line ${state}`}
                    onClick={() => handleSeek(line.startMs / 1000)}
                  >
                    {line.text}
                  </div>
                )
              })}
            </div>
          )}
        </div>
        {(act === 'before' || act === 'freeze') && (
          <div className="ceremony-cta">
            <button type="button" onClick={handleCeremonyClick}>
              {buttonLabel}
            </button>
          </div>
        )}
      </section>
      <audio
        ref={audioRef}
        src="/assets/song.mp3"
        preload="none"
        onPlay={() => setSongPlaying(true)}
        onPause={() => setSongPlaying(false)}
        onEnded={() => setSongPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime((event.target as HTMLAudioElement).currentTime)}
        onLoadedMetadata={(event) => setDuration((event.target as HTMLAudioElement).duration || 0)}
      />
    </div>
  )
}

export default App
