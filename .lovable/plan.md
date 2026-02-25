

# Export, Import, and PDF Export

## Overview

Add three features to the header toolbar: (1) export the current game plan as a JSON file, (2) import a plan from a JSON file, and (3) export a visual PDF report showing all week cards, the chart, and summary info.

## 1. JSON Export

- Serialize the current `GameState` (weeks, startingCredits, luckConfig) to a JSON blob
- Trigger a browser file download as `lethal-plan-YYYY-MM-DD.json`
- Implemented as a utility function `exportGameToFile(state: GameState)` in `src/lib/gameData.ts`

## 2. JSON Import

- Open a file picker (hidden `<input type="file" accept=".json">`)
- Parse the uploaded JSON, validate it has the expected shape (weeks array, startingCredits, luckConfig)
- On success, replace the current game state and show a toast notification
- On failure (bad format), show an error toast
- Implemented as a utility function `importGameFromFile(file: File): Promise<GameState>` in `src/lib/gameData.ts`

## 3. PDF Export (visual report)

- Install `html2canvas` and `jspdf` as dependencies
- Create a new route `/export` that renders a print-friendly page showing:
  - Header with title, luck settings summary, starting credits
  - All week cards stacked vertically (read-only, no interactivity)
  - The metrics chart at the bottom
  - Summary banner (game over status, total weeks)
- Create `src/pages/ExportView.tsx` -- a non-interactive, print-optimized layout
- Create `src/components/WeekCardReadonly.tsx` -- a simplified read-only version of WeekCard (no selects/inputs, just displays the data)
- The PDF generation flow:
  1. Open `/export` in a new window or render it in a hidden container
  2. Use `html2canvas` to capture the full page as a canvas
  3. Use `jspdf` to convert the canvas to a multi-page PDF
  4. Trigger download as `lethal-plan-report.pdf`
- A helper function `generatePDF()` in `src/lib/pdfExport.ts` orchestrates this

## 4. UI Integration in Header

Add three icon buttons to the header toolbar (next to Settings and Reset):

- **Download** icon (lucide `Download`) -- exports JSON
- **Upload** icon (lucide `Upload`) -- triggers file import
- **FileText** icon (lucide `FileText`) -- generates and downloads PDF

## Technical Details

### New dependencies
- `jspdf` -- PDF generation
- `html2canvas` -- DOM-to-canvas rendering

### New files
- `src/lib/pdfExport.ts` -- PDF generation logic
- `src/pages/ExportView.tsx` -- print-friendly full plan view
- `src/components/WeekCardReadonly.tsx` -- read-only week card for PDF

### Modified files
- `src/lib/gameData.ts` -- add `exportGameToFile()` and `importGameFromFile()` functions
- `src/pages/Index.tsx` -- add three toolbar buttons, file input ref, import handler
- `src/App.tsx` -- add `/export` route

### JSON format (export/import)

```json
{
  "weeks": [
    {
      "id": "...",
      "weekNumber": 0,
      "days": ["41", null, "220"],
      "sellAmount": 400
    }
  ],
  "startingCredits": 60,
  "luckConfig": {
    "scrapBias": 0,
    "quotaLuck": 0.1545
  }
}
```

### Validation on import
- Check that `weeks` is an array with valid `weekNumber`, `days` (array of 3), and `sellAmount`
- Check `startingCredits` is a number
- Fall back to default `luckConfig` if missing
- Reject with error toast if structure is invalid

### PDF generation flow
1. Navigate to `/export?source=pdf` (or render in a hidden div)
2. Wait for render, then `html2canvas(document.getElementById('export-root'))`
3. Split the canvas into A4-sized pages
4. Add each page to the jsPDF document
5. Save as `lethal-plan-report.pdf`

