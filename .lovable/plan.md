

# Luck Configuration System

## Overview

Add a settings panel where players can configure two simulation parameters -- **scrap value bias** and **quota luck** -- either manually via sliders or by selecting one of four named presets. These settings are persisted in the game state and feed into the existing calculation pipeline.

## The Two Settings

### 1. Scrap Value Bias (affects daily scrap collected per moon)

A slider from **-200% to +200%** that shifts the expected scrap value for each moon:

- **0%** = the moon's statistical average (`expectedProfit` in PLANETS, unchanged from current behavior)
- **-100%** = the moon's 12.5th percentile value (`P125_scrap_val` from `EnumMetainf`)
- **+100%** = the moon's 87.5th percentile value (`P875_scrap_val` from `EnumMetainf`)
- Values beyond +/-100% extrapolate linearly beyond P12.5/P87.5

The formula per moon at bias `b` (where b is the slider value as a fraction, e.g. 1.0 = 100%):

```text
if b >= 0:
  scrap = average + b * (P875 - average)
if b < 0:
  scrap = average + b * (average - P125)
```

This replaces the static `expectedProfit` lookup in `calculateWeekResults`.

### 2. Quota Luck (affects quota escalation curve)

A slider from **0 to 1** that is passed directly as `luck_val` into `quotaStat.next()`. Higher values = luckier = slower quota growth. Currently hardcoded at 0.1545.

This replaces the hardcoded default in `quotaStat.stepToAndReturn`.

## Four Presets

| Preset Name | Scrap Bias | Quota Luck |
|---|---|---|
| I'm always being unfortunate | -100% | 0.05 |
| Just being probabilistically average | 0% | 0.1545 |
| I trust in my luck | +80% | 0.6 |
| Perfection shall eliminate any uncertainty | +200% | 0.99 |

Selecting a preset sets both sliders. Adjusting either slider manually clears the active preset indicator (switches to "Custom").

## UI Design

A collapsible settings bar placed between the header and the banners in the main layout:

- A gear icon button in the header toggles it open/closed
- When open, it shows:
  - A row of 4 preset buttons (pill-shaped, monospace, the active one highlighted in primary color)
  - Two labeled sliders below:
    - "SCRAP BIAS" with value label showing the percentage
    - "QUOTA LUCK" with value label showing the decimal
- Styled consistently with the dark industrial theme (border-border, bg-card, font-mono)

## Technical Changes

### 1. Extend `GameState` in `src/lib/gameData.ts`

Add a `luckConfig` field to `GameState`:

```typescript
interface LuckConfig {
  scrapBias: number;   // -2.0 to 2.0 (fraction, not percentage)
  quotaLuck: number;   // 0.0 to 1.0
}

interface GameState {
  weeks: WeekData[];
  startingCredits: number;
  luckConfig: LuckConfig;  // new field
}
```

Default value: `{ scrapBias: 0, quotaLuck: 0.1545 }`.

Update `loadGame`, `resetGame` to include the default. Existing saves without this field get the default via a fallback.

### 2. Create scrap bias calculator in `src/lib/gameData.ts`

Add a function `getAdjustedProfit(planetId: string, scrapBias: number): number` that:

- Looks up the moon's `P125_scrap_val`, `P875_scrap_val`, and `expectedProfit` from `EnumMetainf.metamap`
- Applies the linear interpolation formula described above
- Falls back to `expectedProfit` if the moon isn't in `EnumMetainf`

### 3. Thread `luckConfig` through calculations

- `calculateWeekResults` receives `luckConfig` as a parameter
- Daily scrap uses `getAdjustedProfit(pid, luckConfig.scrapBias)` instead of `planet.expectedProfit`
- `getQuotaForWeek` receives `quotaLuck` and passes it to `quotaStat.stepToAndReturn`
- `quotaStat.stepToAndReturn` accepts an optional `luck_val` parameter instead of using the hardcoded default
- `calculateAllWeeks` passes `luckConfig` through

### 4. Create `src/components/LuckSettings.tsx`

A new component with:

- Props: `config: LuckConfig`, `onChange: (config: LuckConfig) => void`
- 4 preset buttons in a horizontal row
- Two `Slider` components (from the existing radix slider in `src/components/ui/slider.tsx`)
- Scrap bias slider: min -200, max 200, step 5, displayed as percentage
- Quota luck slider: min 0, max 100, step 1, internally mapped to 0-1
- Active preset detection: compare current values against preset values to highlight the matching one

### 5. Update `src/pages/Index.tsx`

- Add a `showSettings` toggle state
- Render a gear icon button in the header (next to the reset button)
- Render `LuckSettings` in a collapsible section when toggled
- Pass `game.luckConfig` and an `onChangeLuckConfig` handler that updates the game state
- Pass `game.luckConfig` to `calculateAllWeeks`

