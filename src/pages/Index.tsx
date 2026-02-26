import { useState, useEffect, useCallback, useRef } from "react";
import {
  type GameState,
  type WeekData,
  type LuckConfig,
  createWeek,
  calculateAllWeeks,
  loadGame,
  saveGame,
  resetGame,
  exportGameToFile,
  importGameFromFile,
} from "@/lib/gameData";
import WeekTimeline from "@/components/WeekTimeline";
import WeekCard from "@/components/WeekCard";
import WeekChart from "@/components/WeekChart";
import LuckSettings from "@/components/LuckSettings";
import { Collapsible, CollapsibleContent} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  ArrowBigRight,
  ArrowBigRightDashIcon,
  Download,
  FileText,
  RotateCcw,
  Settings,
  Skull,
  TrendingUp,
  Upload,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generatePDF } from "@/lib/pdfExport";

export default function Index() {
  const [game, setGame] = useState<GameState>(loadGame);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => exportGameToFile(game);

  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importGameFromFile(file);
      setGame(imported);
      setSelectedWeek(0);
      toast({ title: "Plan imported successfully" });
    } catch (err) {
      toast({ title: "Import failed", description: err.message, variant: "destructive" });
    }
    e.target.value = "";
  };

  const handleExportPDF = async () => {
    toast({ title: "Generating PDF..." });
    try {
      await generatePDF();
      toast({ title: "PDF downloaded" });
    } catch (err) {
      toast({ title: "PDF export failed", description: err.message, variant: "destructive" });
    }
  };

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
    setGame((prev) => {
      const newWeeks = [...prev.weeks, createWeek(prev.weeks.length)];
      return { ...prev, weeks: newWeeks };
    });
    setSelectedWeek(game.weeks.length);
  };

  const popWeek = () => {
    setGame((prev) => {
      prev.weeks.pop();
      return prev;
    });
    if (selectedWeek >= game.weeks.length) setSelectedWeek(game.weeks.length-1); else setSelectedWeek(selectedWeek);
  };

  const handleReset = () => {
    if (confirm("Start a new game? All data will be lost.")) {
      setGame(resetGame());
      setSelectedWeek(0);
    }
  };

  const updateLuckConfig = useCallback((luckConfig: LuckConfig) => {
    setGame((prev) => ({ ...prev, luckConfig }));
  }, []);

  const { results, finalCredits, gameOver, gameOverWeek } = calculateAllWeeks(
    game.weeks,
    game.startingCredits,
    game.luckConfig
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
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
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
              <p className="text-xs text-muted-foreground font-mono">
                CREDITS (WEEK {selectedWeek !== null ? selectedWeek : game.weeks.length - 1})
              </p>
              <p className={`font-mono text-2xl font-bold ${
                (selectedWeek !== null
                  ? results[selectedWeek]?.creditsAfter ?? finalCredits
                  : finalCredits) >= 0
                  ? "text-success"
                  : "text-danger"
              }`}>
                ▮{selectedWeek !== null
                  ? results[selectedWeek]?.creditsAfter ?? finalCredits
                  : finalCredits}
              </p>
            </div>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleImportJSON}
              className="hidden"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleExportJSON}
              title="Export Plan (JSON)"
              className="border-border text-muted-foreground hover:text-primary hover:border-primary/50"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              title="Import Plan (JSON)"
              className="border-border text-muted-foreground hover:text-primary hover:border-primary/50"
            >
              <Upload className="w-4 h-4" />
            </Button>
            {/*
            <Button
              variant="outline"
              size="icon"
              onClick={handleExportPDF}
              title="Export PDF Report"
              className="border-border text-muted-foreground hover:text-primary hover:border-primary/50"
            >
              <FileText className="w-4 h-4" />
            </Button>
            */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSettings((s) => !s)}
              title="Luck Settings"
              className="border-border text-muted-foreground hover:text-primary hover:border-primary/50"
            >
              <Settings className="w-4 h-4" />
            </Button>
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

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Luck Settings */}
        <Collapsible open={showSettings} onOpenChange={setShowSettings}>
          <CollapsibleContent>
            <LuckSettings config={game.luckConfig} onChange={updateLuckConfig} />
          </CollapsibleContent>
        </Collapsible>
        {/* Game Over Banner */}
        {(gameOver && results && results[gameOverWeek].sellAmount > 0) && (
          <div className="flex items-center gap-3 bg-danger/10 border border-danger/30 rounded-lg px-4 py-3 glow-red">
            <Skull className="w-6 h-6 text-danger shrink-0" />
            <div>
              <p className="font-mono text-danger font-bold">GAME OVER</p>
              <p className="text-sm text-danger/80 font-mono">
                Quota not met at Week {gameOverWeek}. The Company is not pleased!
              </p>
            </div>
          </div>
        )}
        {/* Game Duration Counter Banner */}
        {!((gameOverWeek == -1) || (gameOver && results && results[gameOverWeek].sellAmount > 0)) && (
            <div className="flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 glow-orange">
              <ArrowBigRightDashIcon className="w-6 h-6 text-primary shrink-0" />
              <div>
                <p className="font-mono text-primary font-bold">THE GAME LASTS...</p>
                <p className="text-sm text-primary/80 font-mono">
                  the plan is only profitable until week {gameOverWeek}/{game.weeks.length}, the company covets more.
                </p>
              </div>
            </div>
        )}
        {/* End-of-planning Indication Banner */}
        {(gameOverWeek == -1) && (
            <div className="flex items-center gap-3 bg-success/10 border border-success/30 rounded-lg px-4 py-3 glow-green">
              <ArrowBigRight className="w-6 h-6 text-success shrink-0" />
              <div>
                <p className="font-mono text-success font-bold">THE GAME IS READY TO BEGIN WITH</p>
                <p className="text-sm text-success/80 font-mono">
                  the plan is profitable and game-ready for all {game.weeks.length} weeks, the company is satisfied for now.
                </p>
              </div>
            </div>
        )}

        {/* Starting credits info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono px-1">
          <TrendingUp className="w-3.5 h-3.5" />
          Starting credits: ▮{game.startingCredits}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono px-1">Weeks</div>
        {/* Timeline */}
        <WeekTimeline
          weeks={game.weeks}
          results={results}
          selectedIndex={selectedWeek}
          gameOverWeek={gameOverWeek}
          onSelect={setSelectedWeek}
          onAddWeek={addWeek}
          onPopWeek={popWeek}
        />

        {/* Selected Week Card */}
        {selectedWeek !== null && game.weeks[selectedWeek] && (
          <div key={selectedWeek} className="animate-card-pop-in">
            <WeekCard
              week={game.weeks[selectedWeek]}
              carryOverScrap={carryChain[selectedWeek]}
              creditsAfter={results[selectedWeek]?.creditsAfter ?? game.startingCredits}
              onUpdate={(w) => updateWeek(selectedWeek, w)}
              luckConfig={game.luckConfig}
            />
          </div>
        )}

        {/* Chart */}
        <WeekChart
          results={results}
          weeks={game.weeks}
          startingCredits={game.startingCredits}
          selectedIndex={selectedWeek}
          onSelectWeek={setSelectedWeek}
          luckConfig={game.luckConfig}
          gameOverWeek={gameOverWeek}
        />

      </main>
    </div>
  );
}
