import { useState, useEffect, useCallback } from "react";
import {
  type GameState,
  type WeekData,
  createWeek,
  calculateAllWeeks,
  loadGame,
  saveGame,
  resetGame,
} from "@/lib/gameData";
import WeekCard from "@/components/WeekCard";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw, Skull, TrendingUp } from "lucide-react";

export default function Index() {
  const [game, setGame] = useState<GameState>(loadGame);

  useEffect(() => {
    saveGame(game);
  }, [game]);

  const updateWeek = useCallback((index: number, updated: WeekData) => {
    setGame((prev) => {
      const weeks = [...prev.weeks];
      weeks[index] = updated;
      return { ...prev, weeks };
    });
  }, []);

  const addWeek = () => {
    setGame((prev) => ({
      ...prev,
      weeks: [...prev.weeks, createWeek(prev.weeks.length)],
    }));
  };

  const handleReset = () => {
    if (confirm("Start a new game? All data will be lost.")) {
      setGame(resetGame());
    }
  };

  const { results, finalCredits, gameOver, gameOverWeek } = calculateAllWeeks(
    game.weeks,
    game.startingCredits
  );

  // Build carry-over chain
  const carryChain: number[] = [0];
  for (let i = 0; i < results.length - 1; i++) {
    carryChain.push(results[i].carryOverScrap);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-mono text-primary text-xl tracking-wider">
              LETHAL COMPANY
            </h1>
            <p className="text-xs text-muted-foreground font-mono tracking-widest uppercase">
              Weekly Planner & Quota Calculator
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-mono">CREDITS</p>
              <p className={`font-mono text-2xl font-bold ${
                finalCredits >= 0 ? "text-success" : "text-danger"
              }`}>
                ₵{finalCredits}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              title="New Game"
              className="border-border text-muted-foreground hover:text-danger hover:border-danger/50"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Game Over Banner */}
        {gameOver && (
          <div className="flex items-center gap-3 bg-danger/10 border border-danger/30 rounded-lg px-4 py-3 glow-red">
            <Skull className="w-6 h-6 text-danger shrink-0" />
            <div>
              <p className="font-mono text-danger font-bold">GAME OVER</p>
              <p className="text-sm text-danger/80 font-mono">
                Quota not met at Week {gameOverWeek}. The Company is not pleased.
              </p>
            </div>
          </div>
        )}

        {/* Starting credits info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono px-1">
          <TrendingUp className="w-3.5 h-3.5" />
          Starting credits: ₵{game.startingCredits}
        </div>

        {/* Week Cards */}
        {game.weeks.map((week, i) => (
          <WeekCard
            key={week.id}
            week={week}
            carryOverScrap={carryChain[i]}
            creditsAfter={results[i]?.creditsAfter ?? game.startingCredits}
            onUpdate={(w) => updateWeek(i, w)}
          />
        ))}

        {/* Add Week */}
        <Button
          onClick={addWeek}
          variant="outline"
          className="w-full border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary/50 font-mono"
        >
          <Plus className="w-4 h-4 mr-2" />
          ADD WEEK {game.weeks.length}
        </Button>
      </main>
    </div>
  );
}
