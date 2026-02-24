import type {WeekData} from "@/lib/gameData.ts";
import {EnumMetainf} from "@/lib/enumerateMetainf.ts";

interface PlanetMetainfoProps {
    week: WeekData;
}

function deduceNonrepeatingPlanets(weekData: WeekData) {
    const memory = [];
    weekData.days.map((day) => {
        if (!(memory.includes(day)) && day !== null) memory.push(day);
    })
    memory.sort((a, b) => a - b);
    return memory;
}

export default function PlanetMetainfoSection({ week }:PlanetMetainfoProps){
    const deducedWeekDayPlanets = deduceNonrepeatingPlanets(week);
    return (
        <div className="border-t border-border pt-4">
            {deducedWeekDayPlanets.map((moon) => {
                return(
                    <div className="grid grid-cols-2 border-t border-border pt-4">
                        <div className="text-foreground">
                            <div className="text-danger">{EnumMetainf.metamap[moon].name}</div>
                            <div>cost ▮{EnumMetainf.metamap[moon].cost} , {EnumMetainf.metamap[moon].difficulty} | {EnumMetainf.metamap[moon].risk_level} , {EnumMetainf.metamap[moon].size}x indoor map size</div>
                            <div className="text-muted-foreground">Moons' stats: <a style={{ textDecoration: "underline" }} href="https://lethal-company.fandom.com/wiki/Moons">Lethal Company Fandom Wiki</a></div>
                        </div>
                        <div className="text-primary">
                            <div className="text-foreground">Number of loots ... <span className="text-primary">{(EnumMetainf.metamap[moon].max_scrap+EnumMetainf.metamap[moon].min_scrap)/2}±{Math.abs(EnumMetainf.metamap[moon].max_scrap-EnumMetainf.metamap[moon].min_scrap)/2}</span></div>
                            <div className="text-foreground">Power level extremes ... <span className="text-primary">{EnumMetainf.metamap[moon].min_power} indoor, {EnumMetainf.metamap[moon].max_power} outdoor</span></div>
                            <div className="text-foreground">Most likely indoor layout ... <span className="text-primary">{EnumMetainf.metamap[moon].likely_layout}({EnumMetainf.metamap[moon].likely_layout_percentage}%)</span></div>
                            <div className="text-muted-foreground">See more information: <a style={{ textDecoration: "underline" }} href={EnumMetainf.metamap[moon].more_info}>Lethal Company Fandom Wiki</a></div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}