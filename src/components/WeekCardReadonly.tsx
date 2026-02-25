import {
  getPlanetById,
  calculateWeekResults,
  type WeekData,
  getAdjustedProfit,
  LuckConfig,
} from "@/lib/gameData";
import { AlertTriangle } from "lucide-react";

interface Props {
  week: WeekData;
  carryOverScrap: number;
  creditsAfter: number;
  luckConfig: LuckConfig;
}

export default function WeekCardReadonly({ week, carryOverScrap, luckConfig }: Props) {
  const result = calculateWeekResults(week, carryOverScrap, luckConfig);

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <div className="px-4 py-3 bg-secondary/50 border-b border-border flex items-center justify-between">
        <span className="font-mono text-primary text-lg">WEEK {week.weekNumber}</span>
        <span className="text-sm text-muted-foreground font-mono">
          Quota: <span className={result.quotaMet ? "text-success" : "text-foreground"}>▮{result.sellAmount}</span>/▮{result.quota}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Day slots */}
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((dayIndex) => {
            const planet = week.days[dayIndex] ? getPlanetById(week.days[dayIndex]!) : null;
            return (
              <div key={dayIndex} className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Day {dayIndex + 1}
                </span>
                <p className="font-mono text-sm text-foreground">
                  {planet ? planet.name : "— None —"}
                </p>
                {planet && (
                  <p className="text-xs text-muted-foreground font-mono">
                    Expected: <span className="text-success">▮{planet.expectedProfit}</span>
                    {planet.expectedProfit !== getAdjustedProfit(planet.id, luckConfig.scrapBias) && (
                      <span>
                        {(getAdjustedProfit(planet.id, luckConfig.scrapBias) - planet.expectedProfit) > 0 ? "+" : ""}
                        {getAdjustedProfit(planet.id, luckConfig.scrapBias) - planet.expectedProfit}(biased)
                      </span>
                    )}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {result.entranceCosts > 0 && (
          <div className="flex items-center gap-2 text-xs text-warning bg-warning/10 px-3 py-2 rounded">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="font-mono">Entrance costs: ▮{result.entranceCosts}</span>
          </div>
        )}

        {/* Sell Day */}
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-4 gap-3 text-sm font-mono">
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
              <span className="text-foreground">▮{week.sellAmount}</span>
            </div>
          </div>
        </div>

        {week.sellAmount > 0 && (
          <div className="border-t border-border pt-4 grid grid-cols-4 gap-3 text-sm font-mono">
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

        {result.unsoldScrap > 0 && (
          <p className="text-xs text-muted-foreground font-mono">
            Unsold scrap carried to next week: <span className="text-foreground">▮{result.unsoldScrap}</span>
          </p>
        )}
      </div>
    </div>
  );
}
