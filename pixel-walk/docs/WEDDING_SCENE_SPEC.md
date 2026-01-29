# Virtual Wedding Scene - MVP Spec (React + CSS Sprite)

## 0. Purpose
Create a virtual wedding venue webpage that plays pixel-art character animations:
- A bride and groom performing a wedding animation on a stage/altar area
- Several small pixel guests celebrating (jumping / cheering) on the sides
This is a **playback-only** experience using pre-made sprite sheets.

## 1. Tech Stack (Fixed)
- React + TypeScript + Vite
- Animation method: **CSS sprite sheets using steps()**
- Rendering: CSS only (NO canvas unless explicitly requested)
- Static-site deployable (Vercel/GitHub Pages)

## 2. Global Rendering Rules (Strict)
- Pixel-perfect only (no smoothing)
- Integer scaling only (e.g., x6)
- Must enforce:
  - `image-rendering: pixelated`
  - avoid sub-pixel transforms (positions should resolve to integers)
If pixels appear blurry, the implementation is invalid.

## 3. Assets (Strict Contract)

### 3.1 Sprite Sheet Standard
- Default frame size: **48x48**
- Layout: horizontal row for each animation (1 row per action)
- File format: PNG with transparent background
- Animation playback: `steps(N)` with `N = frame count`

### 3.2 Naming Convention
All assets go in:



Required main characters:
- `bride.png`
- `groom.png`
- `bride.json`
- `groom.json`

Guests (at least 2 variants, can duplicate positions):
- `guest_a.png`
- `guest_b.png`
- `guest_a.json`
- `guest_b.json`

Optional background layers:
- `bg_sky.png` (optional)
- `bg_venue.png` (optional)
- `bg_stage.png` (optional)

### 3.3 Metadata JSON (Minimal Required Fields)
Each `*.json` must provide:
- frameWidth
- frameHeight
- animations: a mapping of animation name -> { row, frames, fps, loop }

Example:
```json
{
  "frameWidth": 48,
  "frameHeight": 48,
  "animations": {
    "idle": { "row": 0, "frames": 4, "fps": 6, "loop": true },
    "walk": { "row": 1, "frames": 8, "fps": 12, "loop": true }
  }
}
Notes:

row means which horizontal strip to use (row index) if sprite sheets are multi-row.

If a sprite sheet is single-row only, row must be 0.

4. Scene Layout (MVP)
4.1 Screen Regions

Use a fixed viewport scene container (responsive center aligned):

Background layer (optional image or CSS gradient)

Venue layer (optional)

Stage/altar area centered horizontally

4.2 Main Couple Placement

Bride and groom placed near center on stage

They face each other (one can be flipped horizontally)

Baseline aligned (feet on same ground line)

4.3 Guests Placement

Guests appear on left and right sides of the stage (at least 4 total)

Guests can reuse the same sprite assets but must have different positions

Guests perform a looped celebration animation (jump/cheer)

5. Required Animations (MVP)
5.1 Bride & Groom

Must support:

wedding (primary) OR celebrate OR idle (fallback)
MVP acceptance:

At minimum they must be animating in place on stage (not static)

5.2 Guests

Must support:

jump OR cheer OR celebrate (fallback to idle if missing)
MVP acceptance:

At minimum guests must be visibly animating and offset vertically to simulate jumping
(If only sprite frames exist, that is sufficient; extra vertical motion is optional.)

6. Interactions (Minimal)

Provide simple controls (buttons) in the UI:

Toggle Play/Pause (all animations)

Toggle "Ceremony Mode" vs "Party Mode"

Ceremony Mode: couple plays wedding (or idle), guests play idle (or slower cheer)

Party Mode: couple plays celebrate, guests play jump/cheer

No other UI required.

7. Non-Goals (Do NOT implement)

No canvas

No editor

No physics / collisions

No audio (optional later)

No backend/database/auth

No external animation libraries

8. Implementation Requirements (Process)

The agent must:

Read this spec fully

Produce a concise plan (max 10 bullets) with verifiable steps

Wait for approval

Implement exactly as planned

Report:

Files created/modified

How to verify manually

Known limitations / TODOs

9. Acceptance Criteria (MVP)

Accepted only if:

Page loads without errors

Pixel rendering is crisp (no blur)

Bride and groom animate on stage

At least 4 guest sprites animate at sides

UI buttons work: Play/Pause, Ceremony/Party switch

Build succeeds for static deployment
