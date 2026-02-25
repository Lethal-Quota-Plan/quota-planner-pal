import { useMemo } from "react";
import { loadGame, calculateAllWeeks } from "@/lib/gameData";
import WeekCardReadonly from "@/components/WeekCardReadonly";
import WeekChart from "@/components/WeekChart";
import { Skull, ArrowBigRight, ArrowBigRightDashIcon } from "lucide-react";

export default function ExportView() {
  const game = useMemo(() => loadGame(), []);
  const { results, finalCredits, gameOver, gameOverWeek } = useMemo(
    () => calculateAllWeeks(game.weeks, game.startingCredits, game.luckConfig),
    [game]
  );

  const carryChain: number[] = [0];
  for (let i = 0; i < results.length - 1; i++) {
    carryChain.push(results[i].carryOverScrap);
  }

  return (
    <div id="export-root" className="min-h-screen bg-background p-6 space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="font-mono text-primary text-2xl tracking-wider">LETHAL COMPANY</h1>
        <p className="text-xs text-muted-foreground font-mono tracking-widest uppercase">
          Plan Report
        </p>
        <div className="mt-2 flex gap-6 text-xs font-mono text-muted-foreground">
          <span>Starting Credits: ▮{game.startingCredits}</span>
          <span>Final Credits: ▮{finalCredits}</span>
          <span>Scrap Bias: {(game.luckConfig.scrapBias * 100).toFixed(0)}%</span>
          <span>Quota Luck: {game.luckConfig.quotaLuck.toFixed(4)}</span>
        </div>
      </div>

      {/* Status banner */}
      {gameOver && results[gameOverWeek]?.sellAmount > 0 && (
        <div className="flex items-center gap-3 bg-danger/10 border border-danger/30 rounded-lg px-4 py-3">
          <Skull className="w-6 h-6 text-danger shrink-0" />
          <p className="font-mono text-danger font-bold">
            GAME OVER — Quota not met at Week {gameOverWeek}
          </p>
        </div>
      )}
      {gameOverWeek !== -1 && !(gameOver && results[gameOverWeek]?.sellAmount > 0) && (
        <div className="flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-lg px-4 py-3">
          <ArrowBigRightDashIcon className="w-6 h-6 text-primary shrink-0" />
          <p className="font-mono text-primary text-sm">
            Plan profitable until week {gameOverWeek}/{game.weeks.length}
          </p>
        </div>
      )}
      {gameOverWeek === -1 && (
        <div className="flex items-center gap-3 bg-success/10 border border-success/30 rounded-lg px-4 py-3">
          <ArrowBigRight className="w-6 h-6 text-success shrink-0" />
          <p className="font-mono text-success text-sm">
            Plan profitable for all {game.weeks.length} weeks
          </p>
        </div>
      )}

      {/* All week cards */}
      <div className="space-y-3">
        {game.weeks.map((week, i) => (
          <WeekCardReadonly
            key={week.id}
            week={week}
            carryOverScrap={carryChain[i]}
            creditsAfter={results[i]?.creditsAfter ?? game.startingCredits}
            luckConfig={game.luckConfig}
          />
        ))}
      </div>

      {/* Chart */}
      <WeekChart
        results={results}
        weeks={game.weeks}
        startingCredits={game.startingCredits}
        selectedIndex={null}
        onSelectWeek={() => {}}
        luckConfig={game.luckConfig}
        gameOverWeek={gameOverWeek}
      />
    </div>
  );
}
