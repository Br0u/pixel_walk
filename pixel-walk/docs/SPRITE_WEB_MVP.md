# Sprite Web MVP Specification

## 1. Goal
Build a minimal React web application that plays **pre-made pixel-art sprite animations**.

The MVP must display:
- Two chibi pixel characters
- Walking side-by-side
- Looping from left to right
- Pixel-perfect rendering (no smoothing)

This is a **playback-only** project.
No editor, no canvas, no backend.

---

## 2. Tech Stack (Fixed)
- React + TypeScript
- Vite
- Animation method: **CSS sprite sheets using steps()**
- Rendering: CSS only (NO canvas unless explicitly requested)
- Deployment target: static site (Vercel / GitHub Pages)

---

## 3. Character & Asset Rules (Strict)

### Sprite Sheet
- Frame size: **48 x 48 px**
- Frames per animation: **8**
- Layout: **1 row, horizontal**
- Sprite sheet size: **384 x 48 px**
- File format: PNG
- Transparent background

### File Naming
public/assets/
male_walk.png
female_walk.png
male.json
female.json


### Metadata (JSON)
Each character JSON must define:
- frameWidth
- frameHeight
- frames
- fps
- loop

Example fields only, no extra logic.

---

## 4. Animation Rules

- Animation type: walk
- FPS: **12**
- Loop: true
- Use `animation-timing-function: steps(8)`
- No easing, no smooth interpolation

---

## 5. Scene Rules

- Two characters must be rendered **side-by-side**
- Same vertical baseline (feet aligned)
- Fixed horizontal spacing: **8 px**
- Both face right
- Both move at the same speed
- When reaching right edge → reappear from left

---

## 6. Rendering Rules (Must Enforce)

- Pixel-perfect rendering only
- Disable image smoothing
- Use integer scaling only (e.g. x6)
- Must use:
  - `image-rendering: pixelated`
  - No sub-pixel transforms

If pixels look blurry, the implementation is invalid.

---

## 7. Component Responsibilities

### Sprite Component
Responsible for:
- Displaying a sprite sheet
- Playing animation using CSS steps()
- Applying pixel rendering rules
- Accepting config via props (sprite path, metadata, scale)

### Scene Component
Responsible for:
- Background (simple color or image)
- Positioning two Sprite components
- Updating horizontal position over time
- Looping movement

---

## 8. Explicit Non-Goals (Do NOT implement)

- No canvas
- No animation editor
- No sprite generation
- No character customization UI
- No physics system
- No state machines
- No backend / database / auth
- No external animation libraries

---

## 9. Verification Checklist (Acceptance Criteria)

The MVP is accepted ONLY IF:
- The page loads without errors
- Two pixel characters are visible
- Characters animate using sprite frames
- Characters walk side-by-side
- Animation loops correctly
- Pixels are crisp (not blurred)
- Project builds successfully as a static site

---

## 10. Implementation Process (Required)

1. Read this document fully
2. Produce a short implementation PLAN (max 8 steps)
3. Wait for user approval
4. Implement exactly according to the plan
5. Report:
   - Files changed
   - How to verify manually
   - Known limitations
