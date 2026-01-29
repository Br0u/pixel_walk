export type LyricLine = {
  startMs: number
  endMs: number
  text: string
}

const timeToMs = (value: string): number => {
  const clean = value.trim().replace(',', '.')
  const hms = clean.split(':')
  if (hms.length < 2) return 0
  const parts = hms.length === 2 ? ['00', ...hms] : hms
  const [hh, mm, rest] = parts
  const [ss, msRaw = '0'] = rest.split('.')
  const millis = Number(msRaw.padEnd(3, '0').slice(0, 3))
  return (
    Number(hh) * 3600000 +
    Number(mm) * 60000 +
    Number(ss) * 1000 +
    millis
  )
}

export const parseSubtitles = (raw: string): LyricLine[] => {
  const text = raw.replace(/\uFEFF/g, '').replace(/\r/g, '').trim()
  if (!text) return []
  const cleaned = text.replace(/^WEBVTT.*\n+/i, '').trim()
  const blocks = cleaned.split(/\n\n+/)
  const lines: LyricLine[] = []

  for (const block of blocks) {
    const rows = block.split('\n').map((row) => row.trim())
    if (!rows.length) continue

    let timeRowIndex = 0
    if (/^\d+$/.test(rows[0])) {
      timeRowIndex = 1
    }

    const timeRow = rows[timeRowIndex]
    if (!timeRow || !timeRow.includes('-->')) continue
    const [startRaw, endRaw] = timeRow.split('-->').map((part) => part.trim())
    const startMs = timeToMs(startRaw)
    const endMs = timeToMs(endRaw)
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) continue

    const textRows = rows.slice(timeRowIndex + 1).filter(Boolean)
    const cueText = textRows.join(' ')
    if (!cueText) continue
    lines.push({ startMs, endMs, text: cueText })
  }

  return lines.sort((a, b) => a.startMs - b.startMs)
}
