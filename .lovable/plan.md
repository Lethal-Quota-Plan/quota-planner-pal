

# Horizontal Timeline with Pop-out Week Cards

## What Changes

Replace the vertically stacked week cards with a **horizontal timeline** running across the center of the screen. Each week is a clickable node on the timeline. Clicking a node expands the corresponding week card with an animation; clicking again (or clicking a different node) retracts it. Only one card is visible at a time.

## Layout Structure

```text
+----------------------------------------------------------+
|  HEADER (sticky, unchanged)                               |
+----------------------------------------------------------+
|                                                          |
|  [Game Over Banner if applicable]                        |
|                                                          |
|  ----[W0]----[W1]----[W2]----[W3]----[+]---->           |
|              (horizontal scrollable timeline)            |
|                                                          |
|  +----------------------------------------------------+  |
|  |  WEEK CARD (animated pop-out below timeline)       |  |
|  |  (only shown when a node is selected)              |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+
```

## Interaction Flow

1. **Default state**: Timeline visible, no card shown (or Week 0 auto-selected)
2. **Click a node**: The selected node highlights (glow + scale), the week card slides/fades in below the timeline
3. **Click the same node again**: Card retracts (fade out), no card shown
4. **Click a different node**: Current card fades out, new card fades in (with a brief transition)
5. **Add Week button**: A "+" node at the end of the timeline creates a new week and selects it

## Visual Design for Timeline

- A horizontal line (border-border color) with circular nodes positioned on it
- Each node shows the week number and a small status indicator (green check / red X / neutral dot)
- The selected node gets an orange glow ring and slight scale-up
- Nodes with game-over state get a red tint
- The timeline scrolls horizontally when there are many weeks (using overflow-x-auto)
- A "+" button at the tail end of the timeline to add weeks

## Animation Details

- Card entrance: fade-in + slide-up from below the timeline (~300ms ease-out)
- Card exit: fade-out + slide-down (~200ms ease-out)
- Node selection: scale transition + glow ring (~200ms)
- CSS transitions and keyframes only (no animation library needed)

## Technical Plan

### 1. Add keyframes to `tailwind.config.ts`

Add `slide-up`, `slide-down` keyframes and corresponding animation utilities for the card pop-out/retract effect.

### 2. Create `src/components/WeekTimeline.tsx` (new file)

A horizontal scrollable timeline component:
- Receives `weeks[]`, `results[]`, `selectedIndex`, `onSelect(index)`, `onAddWeek()`
- Renders a horizontal flex container with a connecting line and circular node buttons
- Each node displays week number + status icon
- Selected node gets `ring-2 ring-primary scale-110 glow-orange`
- "+" node at the end calls `onAddWeek`
- Auto-scrolls to keep selected node visible using `scrollIntoView`

### 3. Update `src/components/WeekCard.tsx`

- Remove the collapsed/expand toggle header (the timeline handles selection now)
- The card is always shown fully when rendered (no internal collapse state)
- Keep all the existing content: day selectors, sell day, results, unsold scrap info
- Add a week title bar at the top (non-clickable, just informational)

### 4. Update `src/pages/Index.tsx`

- Add `selectedWeek` state (`number | null`, default `0`)
- Replace the week cards map with:
  1. The `WeekTimeline` component
  2. A single conditionally-rendered `WeekCard` wrapped in an animated container
- When `selectedWeek` changes, animate the transition using a CSS class toggle
- The "Add Week" logic moves into the timeline's "+" button handler (add week + auto-select it)
- Remove the standalone "Add Week" button at the bottom

### 5. Add CSS for card animation in `src/index.css`

Add utility classes for the pop-out card container animation (slide-up-fade-in / slide-down-fade-out) using `@layer utilities` to keep everything consistent with the existing style system.

