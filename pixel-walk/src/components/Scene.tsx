import type { AnimationClip, SpriteMeta } from '../types'
import Sprite from './Sprite'

type SceneProps = {
  bride: SpriteMeta
  groom: SpriteMeta
  guests: { name: string; symbol: string }[]
  act: 'establish' | 'vows' | 'before' | 'singing' | 'kiss' | 'celebration' | 'freeze'
  songPlaying: boolean
  blessingActive: boolean
  blessingFadeOut: boolean
}

const pickClip = (meta: SpriteMeta, names: string[]): AnimationClip => {
  for (const name of names) {
    const clip = meta.animations[name]
    if (clip) return clip
  }
  const first = Object.values(meta.animations)[0]
  if (!first) {
    return { row: 0, frames: 1, fps: 1, loop: true }
  }
  return first
}

export default function Scene({ bride, groom, guests, act, songPlaying, blessingActive, blessingFadeOut }: SceneProps) {
  const guestBodies = [
    ' o\n/|\\\n/ \\',
    ' o\n-|-\n/ \\',
    ' o\n\\|/\n/ \\',
    ' o\n/|\\\n _ ',
  ]
  const luxeBanner =
    act === 'celebration' || act === 'singing' ? '*** GRAND BALL ***' : '*** WEDDING CEREMONY ***'
  const sparkleLine = ' . *  .   *  .  *   .  *  . ' as const
  const skyLine = act === 'singing' || act === 'celebration' ? '  *   .   *   .   *   .   *  ' : '  .    .     .    .    .   ' as const
  const heartSymbol = act === 'vows' ? '❤️' : ''
  const showKiss = act === 'kiss'
  const coupleClip = pickClip(bride, ['idle'])
  const groomClip = pickClip(groom, ['idle'])
  const couplePlaying = act === 'singing' || act === 'celebration'
  const guestPositions = [
    { side: 'left', x: 2, y: 38 },
    { side: 'left', x: 6, y: 20 },
    { side: 'left', x: 10, y: 30 },
    { side: 'left', x: 14, y: 12 },
    { side: 'left', x: 18, y: 26 },
    { side: 'left', x: 22, y: 8 },
    { side: 'left', x: 26, y: 18 },
    { side: 'left', x: 30, y: 4 },
    { side: 'right', x: 2, y: 36 },
    { side: 'right', x: 6, y: 18 },
    { side: 'right', x: 10, y: 28 },
    { side: 'right', x: 14, y: 10 },
    { side: 'right', x: 18, y: 24 },
    { side: 'right', x: 22, y: 8 },
    { side: 'right', x: 26, y: 20 },
    { side: 'right', x: 30, y: 6 },
  ]

  return (
    <div className={`scene wedding-scene act-${act} ${songPlaying ? 'song-on' : ''} ${blessingActive ? 'blessing-on' : ''} ${blessingFadeOut ? 'blessing-fade' : ''}`}>
      <pre className="scene-art">
        {`       ${luxeBanner}
${sparkleLine}
  .     *        .      *        .
${skyLine}
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`}
      </pre>
      <div className="scene-backdrop" />
      <div className="scene-curtain">
        <span>{'<3'}</span>
        <span>{'<3'}</span>
        <span>{'<3'}</span>
      </div>
      <div className="scene-decor">
        <span className="sparkle s1">{'*'}</span>
        <span className="sparkle s2">{'*'}</span>
        <span className="sparkle s3">{'+'}</span>
        <span className="sparkle s4">{'*'}</span>
        <span className="sparkle s5">{'o'}</span>
        <span className="ribbon r1">{'~'}</span>
        <span className="ribbon r2">{'~'}</span>
        <span className="confetti c1">{'*'}</span>
        <span className="confetti c2">{'*'}</span>
        <span className="confetti c3">{'*'}</span>
      </div>
      <div className="firework-field">
        <span className="firework f1">{'*'}</span>
        <span className="firework f2">{'+'}</span>
        <span className="firework f3">{'o'}</span>
        <span className="firework f4">{'*'}</span>
        <span className="firework f5">{'+'}</span>
        <span className="firework f6">{'o'}</span>
      </div>
      <div className="firecracker-field">
        <span className="firecracker b1">{'===='}</span>
        <span className="firecracker b2">{'===='}</span>
        <span className="firecracker b3">{'===='}</span>
        <span className="firecracker b4">{'===='}</span>
      </div>
      <div className="cloud-field">
        <span className="cloud c1">{'~ ~ ~'}</span>
        <span className="cloud c2">{'~ ~ ~ ~'}</span>
        <span className="cloud c3">{'~ ~'}</span>
        <span className="cloud c4">{'~ ~ ~ ~ ~'}</span>
        <span className="cloud c5">{'~ ~'}</span>
        <span className="cloud c6">{'~ ~ ~'}</span>
        <span className="cloud c7">{'~ ~ ~ ~'}</span>
        <span className="cloud c8">{'~ ~'}</span>
        <span className="cloud c9">{'~ ~ ~'}</span>
        <span className="cloud c10">{'~ ~ ~ ~ ~'}</span>
      </div>
      <div className="particle-field">
        <span className="particle p1">{'*'}</span>
        <span className="particle p2">{'+'}</span>
        <span className="particle p3">{'*'}</span>
        <span className="particle p4">{'+'}</span>
        <span className="particle p5">{'*'}</span>
        <span className="particle p6">{'+'}</span>
        <span className="particle p7">{'*'}</span>
        <span className="particle p8">{'+'}</span>
        <span className="particle p9">{'*'}</span>
        <span className="particle p10">{'+'}</span>
        <span className="particle p11">{'*'}</span>
        <span className="particle p12">{'+'}</span>
        <span className="particle p13">{'o'}</span>
        <span className="particle p14">{'o'}</span>
        <span className="particle p15">{'*'}</span>
        <span className="particle p16">{'*'}</span>
        <span className="particle p17">{'+'}</span>
        <span className="particle p18">{'+'}</span>
        <span className="particle p19">{'*'}</span>
        <span className="particle p20">{'*'}</span>
        <span className="particle p21">{'+'}</span>
        <span className="particle p22">{'+'}</span>
        <span className="particle p23">{'*'}</span>
        <span className="particle p24">{'+'}</span>
        <span className="particle p25">{'o'}</span>
        <span className="particle p26">{'o'}</span>
        <span className="particle p27">{'+'}</span>
        <span className="particle p28">{'*'}</span>
        <span className="particle p29">{'+'}</span>
        <span className="particle p30">{'*'}</span>
        <span className="particle p31">{'*'}</span>
        <span className="particle p32">{'+'}</span>
        <span className="particle p33">{'o'}</span>
        <span className="particle p34">{'*'}</span>
        <span className="particle p35">{'+'}</span>
        <span className="particle p36">{'o'}</span>
        <span className="particle p37">{'*'}</span>
        <span className="particle p38">{'+'}</span>
        <span className="particle p39">{'*'}</span>
        <span className="particle p40">{'o'}</span>
      </div>
      <div className="scene-stage" />

      <div className="stage-area">
        <div className="couple bride">
          <div className="emoji-name">{bride.name}</div>
          <Sprite
            meta={bride}
            clip={coupleClip}
            playing={couplePlaying}
            className="sprite bride performer"
          />
        </div>
        <div className="couple groom">
          <div className="emoji-name">{groom.name}</div>
          <Sprite
            meta={groom}
            clip={groomClip}
            playing={couplePlaying}
            className="sprite groom performer"
          />
        </div>
      </div>

      {heartSymbol && <div className="scene-heart">{heartSymbol}</div>}
      {showKiss && <div className="scene-kiss">🤵❤️👰</div>}

      {blessingActive && (
        <div className="stage-blessing" role="status" aria-live="polite">
          <div className="blessing-knot">{'囍'}</div>
          <div className="blessing-text">{'书瑞成双，新婚大喜'}</div>
          <div className="blessing-knot">{'囍'}</div>
          <div className="blessing-particles">
            <span className="bp bp1">{'*'}</span>
            <span className="bp bp2">{'+'}</span>
            <span className="bp bp3">{'*'}</span>
            <span className="bp bp4">{'+'}</span>
            <span className="bp bp5">{'*'}</span>
            <span className="bp bp6">{'+'}</span>
            <span className="bp bp7">{'*'}</span>
            <span className="bp bp8">{'+'}</span>
          </div>
        </div>
      )}

      <div className="guest-cloud">
        {guests.map((guest, index) => {
          const pos = guestPositions[index % guestPositions.length]
          const offsetX = `${pos.x}%`
          const offsetY = `${pos.y}px`
          const style =
            pos.side === 'left'
              ? { left: offsetX, bottom: `calc(110px + ${offsetY})` }
              : { right: offsetX, bottom: `calc(110px + ${offsetY})` }
          const headMap: Record<string, string> = {
            '🙌': '😄',
            '🎉': '🥳',
            '🎊': '🤩',
            'o/': '😆',
            '\\o': '😁',
            '🥂': '🙂',
            '✨': '😊',
            '🎈': '😄',
            '🥳': '🥳',
            '😄': '😄',
            '🎵': '😌',
            '💐': '☺️',
            '🤩': '🤩',
          }
          const bodyMap: Record<string, string> = {
            'o/': ' o/\n/| \n/ \\',
            '\\o': ' \\o\n |\\\n/ \\',
            '🙌': ' o\n\\|/\n/ \\',
            '🎉': ' o\n/|\\\n/ \\',
            '🎊': ' o\n-|-\n/ \\',
            '🥂': ' o\n/|\\\n/ \\',
            '✨': ' o\n/|\\\n/ \\',
            '🎈': ' o\n/|\\\n/ \\',
            '🥳': ' o\n\\|/\n/ \\',
            '😄': ' o\n/|\\\n/ \\',
            '🎵': ' o\n-|-\n/ \\',
            '💐': ' o\n/|\\\n/ \\',
            '🤩': ' o\n\\|/\n/ \\',
          }
          const partyBodyMap: Record<string, string> = {
            'o/': ' o/\n/| \n/ \\',
            '\\o': ' \\o\n |\\\n/ \\',
            '🙌': ' o\n\\|/\n/ \\',
            '🎉': ' o\n/|\\\n_/_',
            '🎊': ' o\n-|-\n\\_/',
            '🥂': ' o\n/|\\\n_/_',
            '✨': ' o\n/|\\\n/ \\',
            '🎈': ' o\n/|\\\n/ \\',
            '🥳': ' o\n\\|/\n/ \\',
            '😄': ' o\n/|\\\n/ \\',
            '🎵': ' o\n-|-\n/ \\',
            '💐': ' o\n/|\\\n/ \\',
            '🤩': ' o\n\\|/\n/ \\',
          }
          const headEmoji = headMap[guest.symbol] ?? '🙂'
          const body =
            act === 'celebration'
              ? partyBodyMap[guest.symbol] ?? guestBodies[index % guestBodies.length]
              : bodyMap[guest.symbol] ?? guestBodies[index % guestBodies.length]
          return (
            <div
              key={`guest-${guest.name}-${index}`}
              className={`emoji-person guest guest-${index}`}
              style={{
                ...style,
                animationDelay: `${index * 0.12}s`,
              }}
            >
              <div className="emoji-head">{headEmoji}</div>
              <pre className="emoji-body">{body}</pre>
            </div>
          )
        })}
      </div>

      {act === 'freeze' && (
        <div className="scene-freeze">
          <div>❤️ We Are Married ❤️</div>
          <div>2026.2.06</div>
        </div>
      )}
    </div>
  )
}
