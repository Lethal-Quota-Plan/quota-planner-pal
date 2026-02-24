import {
  PLANETS,
  getPlanetById,
  calculateWeekResults,
  type WeekData,
} from "@/lib/gameData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import PlanetMetainfoSection from "@/components/PlanetMetainfoSection.tsx";
import {deduceNonrepeatingPlanets} from "@/lib/utils.ts";

interface WeekCardProps {
  week: WeekData;
  carryOverScrap: number;
  creditsAfter: number;
  onUpdate: (week: WeekData) => void;
}

export default function WeekCard({ week, carryOverScrap, onUpdate }: WeekCardProps) {
  const result = calculateWeekResults(week, carryOverScrap);

  const setPlanet = (dayIndex: number, planetId: string | null) => {
    const newDays = [...week.days] as [string | null, string | null, string | null];
    newDays[dayIndex] = planetId === "none" ? null : planetId;
    onUpdate({ ...week, days: newDays });
  };

  const setSellAmount = (val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    onUpdate({ ...week, sellAmount: Math.min(num, result.totalAvailableScrap) });
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* Title bar */}
      <div className="px-4 py-3 bg-secondary/50 border-b border-border flex items-center justify-between">
        <span className="font-mono text-primary text-lg">WEEK {week.weekNumber}</span>
        <span className="text-sm text-muted-foreground font-mono">
          Quota: <span className={result.quotaMet ? "text-success" : "text-foreground"}>▮{result.sellAmount}</span>/▮{result.quota}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Day slots */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[0, 1, 2].map((dayIndex) => {
            const planet = week.days[dayIndex] ? getPlanetById(week.days[dayIndex]!) : null;
            return (
              <div key={dayIndex} className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Day {dayIndex + 1}
                </label>
                <Select
                  value={week.days[dayIndex] ?? "none"}
                  onValueChange={(v) => setPlanet(dayIndex, v)}
                >
                  <SelectTrigger className="font-mono text-sm bg-background border-border">
                    <SelectValue placeholder="Select planet..." />
                  </SelectTrigger>
                  <SelectContent className="font-mono">
                    <SelectItem value="none">— None —</SelectItem>
                    {PLANETS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                        {p.entranceCost > 0 && ` (▮${p.entranceCost})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {planet && (
                  <p className="text-xs text-muted-foreground font-mono">
                    Expected: <span className="text-success">▮{planet.expectedProfit}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Entrance costs warning */}
        {result.entranceCosts > 0 && (
          <div className="flex items-center gap-2 text-xs text-warning bg-warning/10 px-3 py-2 rounded">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="font-mono">Entrance costs: ▮{result.entranceCosts}</span>
          </div>
        )}

        {/* Moon Metainfo */}
        {deduceNonrepeatingPlanets(week)[0] && <PlanetMetainfoSection week={week}></PlanetMetainfoSection>}

        {/* Sell Day */}
        <div className="border-t border-border pt-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Day 4 — Sell Day
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm font-mono">
            <div>
              <span className="text-xs text-muted-foreground block">Week Scrap</span>
              <span className="text-foreground">▮{result.weekScrap}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Carried Over</span>
              <span className="text-foreground">▮{carryOverScrap}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Total Available</span>
              <span className="text-primary font-bold">▮{result.totalAvailableScrap}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Sell Amount</span>
              <div style={{ opacity: "0.6" }}>▮
                <input
                  type="number"
                  min={0}
                  max={result.totalAvailableScrap}
                  value={week.sellAmount || ""}
                  onChange={(e) => setSellAmount(e.target.value)}
                  className="h-4 font-mono border-border text-sm mt-0.5"
                  style={{
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    padding: "5px",
                    width: "100px",
                  }}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {week.sellAmount > 0 && (
          <div className="border-t border-border pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm font-mono">
            <div>
              <span className="text-xs text-muted-foreground block">Income</span>
              <span className="text-success">+▮{result.sellAmount}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Overtime</span>
              <span className={result.overtimeBonus > 0 ? "text-success" : "text-muted-foreground"}>
                +▮{result.overtimeBonus}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Costs</span>
              <span className={result.entranceCosts > 0 ? "text-danger" : "text-muted-foreground"}>
                -▮{result.entranceCosts}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Net Change</span>
              <span className={result.creditChange >= 0 ? "text-success font-bold" : "text-danger font-bold"}>
                ▮{result.creditChange >= 0 ? "+" : ""}{result.creditChange}
              </span>
            </div>
          </div>
        )}

        {/* Unsold scrap info */}
        {result.unsoldScrap > 0 && (
          <p className="text-xs text-muted-foreground font-mono">
            Unsold scrap carried to next week: <span className="text-foreground">▮{result.unsoldScrap}</span>
          </p>
        )}
      </div>
    </div>
  );
}
