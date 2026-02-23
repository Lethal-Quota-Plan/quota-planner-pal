import { useRef, useEffect } from "react";
import { CheckCircle2, XCircle, Plus, Circle } from "lucide-react";
import type { WeekData } from "@/lib/gameData";

interface WeekResult {
  quotaMet: boolean;
  sellAmount: number;
  quota: number;
}

interface WeekTimelineProps {
  weeks: WeekData[];
  results: WeekResult[];
  selectedIndex: number | null;
  gameOverWeek: number | null;
  onSelect: (index: number | null) => void;
  onAddWeek: () => void;
}

export default function WeekTimeline({
  weeks,
  results,
  selectedIndex,
  gameOverWeek,
  onSelect,
  onAddWeek,
}: WeekTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  useEffect(() => {
    if (selectedIndex !== null) {
      const node = nodeRefs.current.get(selectedIndex);
      node?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selectedIndex]);

  const handleNodeClick = (index: number) => {
    onSelect(selectedIndex === index ? null : index);
  };

  return (
    <div className="relative py-6">
      <div
        ref={scrollRef}
        className="flex items-center gap-0 overflow-x-auto px-4 pb-2 scrollbar-hide"
      >
        {/* Connecting line background */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-px bg-border pointer-events-none" />

        {weeks.map((week, i) => {
          const result = results[i];
          const isSelected = selectedIndex === i;
          const hasSold = result && result.sellAmount > 0;
          const isGameOver = gameOverWeek !== null && i >= gameOverWeek;

          return (
            <div key={week.id} className="flex items-center shrink-0">
              {i > 0 && <div className="w-10 sm:w-16 h-px bg-border" />}
              <button
                ref={(el) => {
                  if (el) nodeRefs.current.set(i, el);
                }}
                onClick={() => handleNodeClick(i)}
                className={`
                  relative z-[1] flex flex-col items-center gap-1 transition-all duration-200
                  ${isSelected ? "scale-110" : "hover:scale-105"}
                `}
              >
                {/* Node circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm
                    border-2 transition-all duration-200
                    ${isSelected
                      ? "border-primary bg-primary/20 glow-orange"
                      : isGameOver
                        ? "border-danger/50 bg-danger/10"
                        : "border-border bg-secondary hover:border-muted-foreground"
                    }
                  `}
                >
                  <span className={isSelected ? "text-primary font-bold" : "text-foreground"}>
                    {week.weekNumber}
                  </span>
                </div>

                {/* Status indicator */}
                <div className="h-4 flex items-center">
                  {hasSold ? (
                    result.quotaMet ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-danger" />
                    )
                  ) : (
                    <Circle className="w-2.5 h-2.5 text-muted-foreground/40" />
                  )}
                </div>
              </button>
            </div>
          );
        })}

        {/* Add week node */}
        <div className="flex items-center shrink-0">
          {weeks.length > 0 && <div className="w-10 sm:w-16 h-px bg-border" />}
          <button
            onClick={onAddWeek}
            className="relative z-[1] w-10 h-10 rounded-full border-2 border-dashed border-border
              bg-secondary/50 flex items-center justify-center
              hover:border-primary/50 hover:text-primary transition-all duration-200
              text-muted-foreground"
            title={`Add Week ${weeks.length}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
