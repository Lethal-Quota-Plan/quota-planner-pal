

# Lethal Company Weekly Planner & Quota Calculator

## Overview
A dark, thematic single-page app where players plan their weekly routes, track scrap collection, decide how much to sell, and monitor their credit balance against rising quotas — all with local storage persistence.

## Visual Design
- **Dark & industrial theme** inspired by Lethal Company's aesthetic — dark grays, muted oranges/yellows for warnings, green for profit, red for quota danger
- Monospace/industrial fonts for a space-industrial feel
- Week-by-week vertical timeline layout

## Core Features

### 1. Weekly Route Planner
- Each game week shows 3 day slots (Day 1, 2, 3) + a "Sell Day" (Day 4)
- For each day, the player selects a planet from a dropdown (with all 11 planets listed by index-name)
- Entrance costs are deducted from the credit balance once per unique planet visited that week
- Expected scrap collected per day is auto-calculated based on the planet's expected profit value

### 2. Sell Day & Scrap Management
- At the end of each week, the app shows total scrap collected (3 days of planet visits + any unsold scrap carried from prior weeks)
- Player inputs how much scrap value they want to sell
- Unsold scrap carries forward to the next week's pool
- The app validates you can't sell more than you have

### 3. Quota & Overtime Calculator
- Profit quota starts at a constant 500 (placeholder — with a clearly marked spot for the user to later plug in a custom formula per week)
- Overtime bonus calculated as: `(amountSold - profitQuota) / 5` (only when sold exceeds quota)
- Credit balance updated each week: `+amountSold + overtimeBonus - entranceCosts`
- Clear pass/fail indicator per week (did income meet quota?)

### 4. Credit Balance Tracker
- Running credit balance displayed prominently at the top
- Week-by-week breakdown showing: income, overtime bonus, entrance costs, net change
- Game Over detection — if quota is not met, the app flags the failure

### 5. Week Management
- "Add Next Week" button to keep extending the game
- Each week is collapsible/expandable so the timeline stays manageable
- Ability to edit previous weeks and have all downstream calculations recalculate

### 6. Data Persistence
- All entered data (planet selections, sell amounts, week history) saved to browser local storage
- "New Game" button to reset everything

