import {quotaStat} from "@/lib/quotaStat.ts";
import {EnumMetainf} from "@/lib/enumerateMetainf.ts";

export interface Planet {
  id: string;
  name: string;
  entranceCost: number;
  expectedProfit: number;
}

export const PLANETS: Planet[] = [
  { id: "41", name: "41-Experimentation", entranceCost: 0, expectedProfit: 295 },
  { id: "220", name: "220-Assurance", entranceCost: 0, expectedProfit: 543 },
  { id: "56", name: "56-Vow", entranceCost: 0, expectedProfit: 522 },
  { id: "21", name: "21-Offense", entranceCost: 0, expectedProfit: 588 },
  { id: "61", name: "61-March", entranceCost: 0, expectedProfit: 561 },
  { id: "20", name: "20-Adamance", entranceCost: 0, expectedProfit: 680 },
  { id: "85", name: "85-Rend", entranceCost: 550, expectedProfit: 1192 },
  { id: "7", name: "7-Dine", entranceCost: 600, expectedProfit: 2679 },
  { id: "8", name: "8-Titan", entranceCost: 700, expectedProfit: 1461 },
  { id: "68", name: "68-Artifice", entranceCost: 1500, expectedProfit: 1627 },
  { id: "5", name: "5-Embrion", entranceCost: 150, expectedProfit: 603 },
];

export interface LuckConfig {
  scrapBias: number;   // -2.0 to 2.0
  quotaLuck: number;   // 0.0 to 1.0
}

export const DEFAULT_LUCK_CONFIG: LuckConfig = { scrapBias: 0, quotaLuck: 0.1545 };

export interface WeekData {
  id: string;
  weekNumber: number;
  days: [string | null, string | null, string | null];
  sellAmount: number;
}

export interface GameState {
  weeks: WeekData[];
  startingCredits: number;
  luckConfig: LuckConfig;
}

export function createWeek(weekNumber: number): WeekData {
  return {
    id: crypto.randomUUID(),
    weekNumber,
    days: [null, null, null],
    sellAmount: 0,
  };
}

export function getPlanetById(id: string): Planet | undefined {
  return PLANETS.find((p) => p.id === id);
}

export function getAdjustedProfit(planetId: string, scrapBias: number): number {
  const planet = getPlanetById(planetId);
  if (!planet) return 0;
  const meta = EnumMetainf.metamap[planetId];
  if (!meta || meta.P125_scrap_val < 0) return planet.expectedProfit;

  const avg = planet.expectedProfit;
  if (scrapBias >= 0) {
    return Math.round(avg + scrapBias * (meta.P875_scrap_val - avg));
  } else {
    return Math.round(avg + scrapBias * (avg - meta.P125_scrap_val));
  }
}

/**
 * Calculate the profit quota for a given week.
 */
export function getQuotaForWeek(_weekNumber: number, quotaLuck: number = 0.1545): number {
  return quotaStat.stepToAndReturn(_weekNumber, quotaLuck);
}

export function calculateWeekResults(week: WeekData, carryOverScrap: number, luckConfig: LuckConfig = DEFAULT_LUCK_CONFIG) {
  // Scrap collected this week (adjusted by bias)
  const dailyScrap = week.days.map((pid) => (pid ? getAdjustedProfit(pid, luckConfig.scrapBias) : 0));
  const weekScrap = dailyScrap.reduce((a, b) => a + b, 0);
  const totalAvailableScrap = weekScrap + carryOverScrap;

  // Entrance costs — unique planets only, paid once per week
  const uniquePlanets = new Set(week.days.filter(Boolean) as string[]);
  const entranceCosts = Array.from(uniquePlanets).reduce(
    (sum, pid) => sum + (getPlanetById(pid)?.entranceCost ?? 0),
    0
  );

  const sellAmount = Math.min(week.sellAmount, totalAvailableScrap);

  const quota = getQuotaForWeek(week.weekNumber, luckConfig.quotaLuck);
  const quotaMet = sellAmount >= quota;
  const overtimeBonus = sellAmount > quota ? Math.max(Math.floor((sellAmount - quota) / 5)-15,0) : 0;

  const creditChange = sellAmount + overtimeBonus - entranceCosts;
  const unsoldScrap = totalAvailableScrap - sellAmount;

  return {
    dailyScrap,
    weekScrap,
    totalAvailableScrap,
    entranceCosts,
    sellAmount,
    quota,
    quotaMet,
    overtimeBonus,
    creditChange,
    unsoldScrap,
  };
}

export function calculateAllWeeks(weeks: WeekData[], startingCredits: number, luckConfig: LuckConfig = DEFAULT_LUCK_CONFIG) {
  let credits = startingCredits;
  let carryOverScrap = 0;
  let gameOver = false;
  let gameOverWeek = -1;

  const results = weeks.map((week) => {
    const r = calculateWeekResults(week, carryOverScrap, luckConfig);
    credits += r.creditChange;
    carryOverScrap = r.unsoldScrap;

    if (!r.quotaMet && !gameOver) {
      gameOver = true;
      gameOverWeek = week.weekNumber;
    }

    return { ...r, creditsAfter: credits, carryOverScrap };
  });

  return { results, finalCredits: credits, gameOver, gameOverWeek };
}

const STORAGE_KEY = "lethal-company-planner";

export function loadGame(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...parsed, luckConfig: parsed.luckConfig ?? DEFAULT_LUCK_CONFIG };
    }
  } catch { /* empty */ }
  return { weeks: [createWeek(0)], startingCredits: 60, luckConfig: DEFAULT_LUCK_CONFIG };
}

export function saveGame(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetGame(): GameState {
  localStorage.removeItem(STORAGE_KEY);
  return { weeks: [createWeek(0)], startingCredits: 60, luckConfig: DEFAULT_LUCK_CONFIG };
}
