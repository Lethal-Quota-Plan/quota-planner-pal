import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type {WeekData} from "@/lib/gameData.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function deduceNonrepeatingPlanets(weekData: WeekData) {
  const memory = [];
  weekData.days.map((day) => {
    if (!(memory.includes(day)) && day !== null) memory.push(day);
  })
  memory.sort((a, b) => a - b);
  return memory;
}