import {averageClampedY} from "@/lib/randomizationCurve.ts";

export class quotaStat {
    static quotaList = [130];
    static luckList = [0]
    static next_iteration = 1;

    static next(luck_val: number = 0.1545) {
        const increment = (1 + Math.pow(quotaStat.next_iteration,2) / 16) * (1 + averageClampedY(1-luck_val)) * 100;
        quotaStat.quotaList.push(Math.floor(quotaStat.quotaList[quotaStat.next_iteration-1]+increment+.25));
        quotaStat.next_iteration ++;
    }

    static stepToAndReturn(iteration_index: number, luck_val: number = 0.1545) {
        quotaStat.quotaList = [130]
        quotaStat.next_iteration = 1;
        while (quotaStat.next_iteration <= iteration_index) {
            quotaStat.next(luck_val);
        }
        return quotaStat.quotaList[iteration_index];
    }

    static setLuckAtIndex(luck_val:number, index: number) {
        while (this.luckList.length <= index) {
            this.luckList.push(this.luckList[-1]);
        }
        this.luckList[index] = luck_val;
    }
}