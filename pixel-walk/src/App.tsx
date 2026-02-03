import './App.css'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type SyntheticEvent,
} from 'react'
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
type FireworkParticle = {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  radius: number
  color: string
}
type FireworkBurst = {
  particles: FireworkParticle[]
}
const SCENE_GUESTS = [
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
] as const

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
  const [overlapActive, setOverlapActive] = useState(false)
  const [finaleLocked, setFinaleLocked] = useState(false)
  const [fireworksVisible, setFireworksVisible] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lyricRefs = useRef<Array<HTMLDivElement | null>>([])
  const burstIdRef = useRef(0)
  const sceneWrapRef = useRef<HTMLDivElement | null>(null)
  const fireworksCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const fireworksCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const fireworksRef = useRef<FireworkBurst[]>([])
  const fireworksRafRef = useRef<number | null>(null)
  const fireworksTimerRef = useRef<number | null>(null)
  const fireworksActiveRef = useRef(false)
  const prevTimeRef = useRef(0)

  useEffect(() => {
    loadSubtitles().then(setLyrics).catch(() => setLyrics([]))
  }, [])

  const createFirework = useCallback((x: number, y: number): FireworkBurst => {
    const particles: FireworkParticle[] = Array.from({ length: 56 }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = 1.5 + Math.random() * 4.8
      const color = `hsl(${Math.random() * 360}, 100%, 60%)`
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (1.5 + Math.random() * 2),
        alpha: 1,
        radius: 1.6 + Math.random() * 2.4,
        color,
      }
    })
    return { particles }
  }, [])

  const startFireworksLoop = useCallback(() => {
    if (fireworksRafRef.current !== null) return
    const ctx = fireworksCtxRef.current
    const canvas = fireworksCanvasRef.current
    if (!ctx || !canvas) return

    const step = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      if (!fireworksActiveRef.current && fireworksRef.current.length === 0) {
        ctx.clearRect(0, 0, width, height)
        fireworksRafRef.current = null
        return
      }

      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'

      const nextBursts: FireworkBurst[] = []
      for (const burst of fireworksRef.current) {
        const nextParticles: FireworkParticle[] = []
        for (const particle of burst.particles) {
          particle.x += particle.vx
          particle.y += particle.vy
          particle.vy += 0.06
          particle.alpha -= 0.0012
          if (particle.alpha <= 0) continue
          ctx.globalAlpha = particle.alpha
          ctx.fillStyle = particle.color
          ctx.shadowBlur = 12
          ctx.shadowColor = particle.color
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
          ctx.fill()
          nextParticles.push(particle)
        }
        if (nextParticles.length > 0) {
          nextBursts.push({ particles: nextParticles })
        }
      }
      fireworksRef.current = nextBursts
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'

      fireworksRafRef.current = window.requestAnimationFrame(step)
    }

    fireworksRafRef.current = window.requestAnimationFrame(step)
  }, [])

  const triggerFireworks = useCallback((count = 6) => {
    const canvas = fireworksCanvasRef.current
    if (!canvas) return
    const width = canvas.clientWidth || window.innerWidth
    const height = canvas.clientHeight || window.innerHeight
    for (let i = 0; i < count; i += 1) {
      const x = width * (0.18 + Math.random() * 0.64)
      const y = height * (0.12 + Math.random() * 0.35)
      fireworksRef.current.push(createFirework(x, y))
    }
    fireworksActiveRef.current = true
    setFireworksVisible(true)
    startFireworksLoop()
    if (fireworksTimerRef.current !== null) {
      window.clearTimeout(fireworksTimerRef.current)
    }
    fireworksTimerRef.current = window.setTimeout(() => {
      fireworksActiveRef.current = false
      setFireworksVisible(false)
    }, 15000)
  }, [createFirework, startFireworksLoop])

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
      setFinaleLocked(true)
      setAct('singing')
      triggerFireworks(7)
    } else if (act === 'freeze') {
      setButtonLabel('💍 结婚')
      setFinaleLocked(false)
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
    prevTimeRef.current = value
    setCurrentTime(value)
  }

  const handleTimeUpdate = (event: SyntheticEvent<HTMLAudioElement>) => {
    const next = event.currentTarget.currentTime
    if (songPlaying && prevTimeRef.current < finaleStart && next >= finaleStart) {
      triggerFireworks(8)
    }
    prevTimeRef.current = next
    setCurrentTime((prev) => (Math.abs(prev - next) < 0.016 ? prev : next))
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
  const finaleStart = 169.6
  const finaleEnd = 202.6
  const finaleDuration = Math.max(0, finaleEnd - finaleStart)
  const finaleWindow = currentTime >= finaleStart && currentTime <= finaleEnd
  const finaleManual = finaleLocked
  const finaleActive = finaleWindow || finaleManual
  const finaleOffset = Math.min(Math.max(currentTime - finaleStart, 0), finaleDuration)

  useEffect(() => {
    if (activeIndex < 0) return
    const node = lyricRefs.current[activeIndex]
    node?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [activeIndex])

  useEffect(() => {
    const canvas = fireworksCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    fireworksCtxRef.current = ctx

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const width = window.innerWidth
      const height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    const wrap = sceneWrapRef.current
    if (!wrap) return

    let rafId = 0
    const measure = () => {
      const scene = wrap.querySelector('.scene') as HTMLElement | null
      const bride = wrap.querySelector('.couple.bride') as HTMLElement | null
      const groom = wrap.querySelector('.couple.groom') as HTMLElement | null
      if (!scene || !bride || !groom) return
      const sceneRect = scene.getBoundingClientRect()
      const brideRect = bride.getBoundingClientRect()
      const groomRect = groom.getBoundingClientRect()
      const brideOverflow = brideRect.left < sceneRect.left || brideRect.right > sceneRect.right
      const groomOverflow = groomRect.left < sceneRect.left || groomRect.right > sceneRect.right
      setOverlapActive(brideOverflow || groomOverflow)
    }

    const scheduleMeasure = () => {
      window.cancelAnimationFrame(rafId)
      rafId = window.requestAnimationFrame(measure)
    }

    scheduleMeasure()
    const ro = new ResizeObserver(scheduleMeasure)
    ro.observe(wrap)
    window.addEventListener('resize', scheduleMeasure)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', scheduleMeasure)
      window.cancelAnimationFrame(rafId)
    }
  }, [act])

  useEffect(() => () => {
    if (fireworksTimerRef.current !== null) {
      window.clearTimeout(fireworksTimerRef.current)
    }
    if (fireworksRafRef.current !== null) {
      window.cancelAnimationFrame(fireworksRafRef.current)
    }
    fireworksTimerRef.current = null
    fireworksRafRef.current = null
    fireworksRef.current = []
  }, [])

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

  const finaleSpriteBase = useMemo(
    () => ({
      sheet: '/assets/new/bb.png',
      frameWidth: 256,
      frameHeight: 256,
      rows: 1,
      scale: 1,
      animations: {
        idle: { row: 0, frames: 1, fps: 1, loop: true },
      },
    }),
    [],
  )

  const finaleBrideSprite = useMemo(
    () => ({
      ...finaleSpriteBase,
      name: brideSprite.name,
    }),
    [finaleSpriteBase, brideSprite.name],
  )

  const finaleGroomSprite = useMemo(
    () => ({
      ...finaleSpriteBase,
      name: groomSprite.name,
    }),
    [finaleSpriteBase, groomSprite.name],
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

  const buildBlessingStyle = (particle: BlessingParticle) =>
    ({
      left: particle.x,
      top: particle.y,
      fontSize: `${particle.size}px`,
      animationDelay: `${particle.delay}s`,
      '--drift': `${particle.drift}px`,
    }) as CSSProperties

  return (
    <div className={`app ${sealed ? 'sealed' : 'opened'}`} onPointerDown={handleBlessingBurst}>
      <canvas
        ref={fireworksCanvasRef}
        className={`fireworks-canvas ${fireworksVisible ? 'active' : ''}`}
        aria-hidden="true"
      />
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
            style={buildBlessingStyle(particle)}
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
      <section className={`scene-shell ${overlapActive ? 'couple-overlap' : ''}`}>
        <div className="scene-scroll" ref={sceneWrapRef}>
          <Scene
          act={act}
          songPlaying={songPlaying}
          reelActive={reelActive}
          reelFadeOut={reelFadeOut}
          blessingActive={blessingActive}
          blessingFadeOut={blessingFadeOut}
          bride={finaleActive ? finaleBrideSprite : brideSprite}
          groom={finaleActive ? finaleGroomSprite : groomSprite}
          finaleActive={finaleActive}
          finaleFade={finaleWindow}
          finaleOffset={finaleOffset}
          finaleDuration={finaleDuration}
          guests={SCENE_GUESTS}
          />
        </div>
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
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(event) => setDuration((event.target as HTMLAudioElement).duration || 0)}
      />
    </div>
  )
}

export default App
