import { useRef, useEffect } from "react";
import {Plus} from "lucide-react";
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
  const weekNodeSeparation = 1.2;

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
    <div className="relative py-6 overflow-hidden h-6">
      <div
        ref={scrollRef}
        className="flex items-center gap-0 px-4 pb-2"
      >
        {/* Connecting line background */}
        {
          weeks.length > 0 &&
            <div>
              <div className="absolute left-6 right-9 h-px bg-border pointer-events-none" style={{ top: "120%", width: (weeks.length*(weekNodeSeparation+2.5)-1)+"rem" }} />
              <div className="absolute" style={{ top: "calc(120% - 0.162rem)", left: (weeks.length*(weekNodeSeparation+2.5)+.1)+"rem" }}>
                <div style={{ height: "0.33rem" }}><div className="relative h-px bg-border pointer-events-none rotate-45 w-2"></div></div>
                <div style={{ height: "0.33rem" }}><div className="relative h-px bg-border pointer-events-none -rotate-45 w-2"></div></div>
              </div>
            </div>
        }
        {weeks.map((week, i) => {
          const result = results[i];
          const isSelected = selectedIndex === i;
          const hasSold = result && result.sellAmount > 0;
          const isGameOver = gameOverWeek !== null && i >= gameOverWeek && gameOverWeek !== -1;

          return (
            <div key={week.id} className="flex items-center shrink-0 h-12">
              {i > 0 && <div className="h-px bg-border" style={{ width: weekNodeSeparation+"rem" }}/>}
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
                      ? "border-primary bg-primary/20"
                      : hasSold ? 
                        isGameOver ? "border-danger/50 bg-danger/10" : "border-success/50 bg-success/10" 
                        : "border-border/50 bg-secondary/10"
                        
                    }
                  `}
                >
                  <span className={isSelected ? "text-primary font-bold" : "text-foreground"}>
                    {week.weekNumber}
                  </span>
                </div>
              </button>
            </div>
          );
        })}

        {/* Add week node */}
        <div className="flex items-center shrink-0">
          {weeks.length > 0 && <div className="h-px bg-border" style={{ width: weekNodeSeparation+"rem" }}/>}
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
