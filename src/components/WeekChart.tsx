import { useMemo } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { WeekData } from "@/lib/gameData";

interface WeekResult {
  creditsAfter: number;
  quota: number;
  sellAmount: number;
  overtimeBonus: number;
  creditChange: number;
  carryOverScrap: number;
}

interface WeekChartProps {
  results: WeekResult[];
  weeks: WeekData[];
  startingCredits: number;
  selectedIndex: number | null;
  onSelectWeek: (index: number) => void;
}

const COLORS = {
  credits: "hsl(140 60% 40%)",
  quota: "hsl(35 90% 55%)",
  sold: "hsl(50 90% 60%)",
  overtime: "hsl(180 60% 50%)",
  creditChange: "hsl(270 60% 60%)",
  unsoldScrap: "hsl(220 10% 50%)",
};

export default function WeekChart({
  results,
  weeks,
  selectedIndex,
  onSelectWeek,
}: WeekChartProps) {
  const data = useMemo(
    () =>
      results.map((r, i) => ({
        week: weeks[i]?.weekNumber ?? i,
        index: i,
        credits: r.creditsAfter,
        quota: r.quota,
        sold: r.sellAmount,
        overtime: r.overtimeBonus,
        creditChange: r.creditChange,
        unsoldScrap: r.carryOverScrap,
      })),
    [results, weeks]
  );

  const handleClick = (state: any) => {
    if (state?.activeTooltipIndex != null) {
      onSelectWeek(state.activeTooltipIndex);
    }
  };

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <div className="px-4 py-2 border-b border-border bg-muted/30">
        <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Weekly Metrics
        </h2>
      </div>
      <div className="p-2">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart
            data={data}
            onClick={handleClick}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(220 10% 30% / 0.3)"
            />
            <XAxis
              dataKey="week"
              tick={{ fill: "hsl(220 10% 60%)", fontSize: 11, fontFamily: "monospace" }}
              axisLine={{ stroke: "hsl(220 10% 30%)" }}
              tickLine={{ stroke: "hsl(220 10% 30%)" }}
              label={{
                value: "Week",
                position: "insideBottomRight",
                offset: -5,
                fill: "hsl(220 10% 50%)",
                fontSize: 10,
                fontFamily: "monospace",
              }}
            />
            <YAxis
              tick={{ fill: "hsl(220 10% 60%)", fontSize: 10, fontFamily: "monospace" }}
              axisLine={{ stroke: "hsl(220 10% 30%)" }}
              tickLine={{ stroke: "hsl(220 10% 30%)" }}
            />
            <ReferenceLine y={0} stroke="hsl(220 10% 40%)" strokeDasharray="2 2" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220 15% 13%)",
                border: "1px solid hsl(220 10% 25%)",
                borderRadius: 8,
                fontFamily: "monospace",
                fontSize: 11,
              }}
              labelStyle={{ color: "hsl(220 10% 70%)", fontWeight: 700 }}
              labelFormatter={(v) => `Week ${v}`}
              itemStyle={{ padding: "1px 0" }}
              cursor={{ stroke: "hsl(35 90% 55% / 0.3)" }}
            />
            <Legend
              wrapperStyle={{ fontSize: 10, fontFamily: "monospace" }}
            />
            <Line
              type="monotone"
              dataKey="credits"
              name="Credit Balance"
              stroke={COLORS.credits}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5, stroke: COLORS.credits, strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="quota"
              name="Quota"
              stroke={COLORS.quota}
              strokeDasharray="6 3"
              strokeWidth={1.5}
              dot={{ r: 2 }}
            />
            <Line
              type="monotone"
              dataKey="sold"
              name="Quota Fulfilled"
              stroke={COLORS.sold}
              strokeWidth={1.5}
              dot={{ r: 2 }}
            />
            <Line
              type="monotone"
              dataKey="overtime"
              name="Overtime Bonus"
              stroke={COLORS.overtime}
              strokeWidth={1.5}
              dot={{ r: 2 }}
            />
            <Line
              type="monotone"
              dataKey="creditChange"
              name="Credit Change"
              stroke={COLORS.creditChange}
              strokeWidth={1.5}
              dot={{ r: 2 }}
            />
            <Line
              type="monotone"
              dataKey="unsoldScrap"
              name="Unsold Scrap"
              stroke={COLORS.unsoldScrap}
              strokeDasharray="4 2"
              strokeWidth={1.5}
              dot={{ r: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
