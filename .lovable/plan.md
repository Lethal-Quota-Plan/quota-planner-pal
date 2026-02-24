

# Graph Visualization + Per-Week Balance Display

## Overview

Add a multi-line chart below the timeline that plots key metrics across all weeks, and replace the final credit balance in the header with the selected week's end-of-week balance.

## Data Series (6 lines)

All plotted against the X-axis (Week number):

1. **Credit Balance** -- `creditsAfter` per week (line, green)
2. **Quota** -- the required quota value per week (line, orange/dashed)
3. **Quota Fulfilled** -- the actual `sellAmount` per week (line, yellow)
4. **Overtime Bonus** -- `overtimeBonus` per week (bar or line, cyan)
5. **Credit Change** -- `creditChange` per week, i.e. the net credit gained that week (bar or line, purple)
6. **Unsold Scrap** -- `carryOverScrap` accumulation per week (line, muted gray)

All this data is already computed by `calculateAllWeeks` -- no new calculations needed.

## Header Change

Replace the static `finalCredits` display in the header with the **selected week's** `creditsAfter` value. When no week is selected, show the latest week's balance. Label it "CREDITS (WEEK N)".

## Technical Plan

### 1. Create `src/components/WeekChart.tsx`

A new component using `recharts` (already installed) with `ChartContainer` from the existing chart UI primitives:

- **Props**: `results[]`, `weeks[]`, `startingCredits`, `selectedIndex`, `onSelectWeek(index)`
- Transform `results` into chart data: `[{ week: 0, credits: 60, quota: 500, sold: 0, overtime: 0, creditChange: 0, unsoldScrap: 0 }, ...]`
- Use `ComposedChart` with:
  - `Line` for Credit Balance (green, stroke-width 2)
  - `Line` for Quota (orange, dashed)
  - `Line` for Quota Fulfilled / Sold (yellow)
  - `Line` for Overtime Bonus (cyan)
  - `Line` for Credit Change (purple)
  - `Line` for Unsold Scrap (gray, dashed)
- Custom tooltip showing all values for the hovered week
- Clickable data points -- clicking a point on the chart selects that week (calls `onSelectWeek`)
- Dark-themed axes and grid matching the app's industrial style
- A `ReferenceLine` at y=0 for the credit balance axis
- Responsive container that fits the `max-w-3xl` content area
- Legend at the bottom with color-coded labels

### 2. Update `src/pages/Index.tsx`

- Import and render `WeekChart` between the timeline and the week card
- Pass `results`, `weeks`, `game.startingCredits`, `selectedWeek`, and `setSelectedWeek`
- In the header, replace `finalCredits` with the selected week's `creditsAfter` (or latest week if none selected)
- Add a label showing which week's balance is displayed

### 3. Styling

- Use the existing theme colors via CSS variables:
  - Green (`hsl(140 60% 40%)`) for credit balance
  - Orange (`hsl(35 90% 55%)`) for quota
  - Yellow (`hsl(50 90% 60%)`) for sold amount
  - Cyan (`hsl(180 60% 50%)`) for overtime
  - Purple (`hsl(270 60% 60%)`) for credit change
  - Gray (`hsl(220 10% 50%)`) for unsold scrap
- Chart background transparent (inherits card bg)
- Grid lines use `border` color at low opacity
- Wrap chart in a card container with a "WEEKLY METRICS" title bar in monospace font

