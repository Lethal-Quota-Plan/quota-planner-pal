import { type LuckConfig } from "@/lib/gameData";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const PRESETS: { label: string; config: LuckConfig }[] = [
  { label: "I'm always being unfortunate", config: { scrapBias: -1.0, quotaLuck: 0.05 } },
  { label: "Just being probabilistically average", config: { scrapBias: 0, quotaLuck: 0.1545 } },
  { label: "I trust in my luck", config: { scrapBias: 0.8, quotaLuck: 0.6 } },
  { label: "Perfection shall eliminate any uncertainty", config: { scrapBias: 2.0, quotaLuck: 0.99 } },
];

function matchesPreset(config: LuckConfig, preset: LuckConfig): boolean {
  return Math.abs(config.scrapBias - preset.scrapBias) < 0.001 &&
    Math.abs(config.quotaLuck - preset.quotaLuck) < 0.001;
}

interface LuckSettingsProps {
  config: LuckConfig;
  onChange: (config: LuckConfig) => void;
}

export default function LuckSettings({ config, onChange }: LuckSettingsProps) {
  const activePreset = PRESETS.findIndex((p) => matchesPreset(config, p.config));

  return (
    <div className="border border-border bg-card rounded-lg p-4 space-y-4 font-mono">
      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset, i) => (
          <Button
            key={i}
            variant={activePreset === i ? "default" : "outline"}
            size="sm"
            className="text-xs font-mono rounded-full"
            onClick={() => onChange(preset.config)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Sliders */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground uppercase tracking-wider">Scrap Bias</span>
            <span className="text-primary">{config.scrapBias >= 0 ? "+" : ""}{Math.round(config.scrapBias * 100)}%</span>
          </div>
          <Slider
            min={-200}
            max={200}
            step={5}
            value={[Math.round(config.scrapBias * 100)]}
            onValueChange={([v]) => onChange({ ...config, scrapBias: v / 100 })}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground uppercase tracking-wider">Quota Luck</span>
            <span className="text-primary">{config.quotaLuck.toFixed(4)}</span>
          </div>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[Math.round(config.quotaLuck * 100)]}
            onValueChange={([v]) => onChange({ ...config, quotaLuck: v / 100 })}
          />
        </div>
      </div>
    </div>
  );
}
