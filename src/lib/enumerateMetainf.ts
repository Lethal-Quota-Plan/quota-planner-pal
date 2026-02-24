export class moonMetainf {
    name: string;
    description: string;
    difficulty: string;
    risk_level: string;
    cost: number;
    likely_layout: string;
    likely_layout_percentage: number;
    size: number;
    min_scrap: number;
    max_scrap: number;
    unit_min_scrap_avg: number;
    unit_max_scrap_avg: number;
    P125_scrap_val: number;
    P875_scrap_val: number;
    power_indoor: number;
    power_outside: number;
    more_info: string;
    confidential_interval_border: number;

    constructor(name: string, description: string, difficulty: string, risk_level: string, cost: number, likely_layout: string, likely_layout_percentage: number, size: number, min_scrap: number, max_scrap: number, power_indoor: number, power_outside: number, more_info: string, unit_min_scrap_avg: number, unit_max_scrap_avg: number, P125_scrap_val: number, P875_scrap_val: number) {
        this.name = name;
        this.description = description;
        this.difficulty = difficulty;
        this.risk_level = risk_level;
        this.cost = cost;
        this.likely_layout = likely_layout;
        this.likely_layout_percentage = likely_layout_percentage;
        this.size = size;
        this.min_scrap = min_scrap;
        this.max_scrap = max_scrap;
        this.unit_min_scrap_avg = unit_min_scrap_avg;
        this.unit_max_scrap_avg = unit_max_scrap_avg;
        this.P125_scrap_val = P125_scrap_val;
        this.P875_scrap_val = P875_scrap_val;
        this.power_indoor = power_indoor;
        this.power_outside = power_outside;
        this.more_info = more_info;
    }
}

export class EnumMetainf {
    static GORDION = new moonMetainf(
        "71-Gordion",
        "place_holder_please_ignore",
        "Safe",
        "Safe",
        0,
        "-",
        0,
        0.00,
        0,
        0,
        0,
        0,
        "https://lethal-company.fandom.com/wiki/Gordion",
        0,
        0,
        0,
        0
    );

    static EXPERIMENTATION = new moonMetainf(
        "41-Experimentation",
        "place_holder_please_ignore",
        "Easy",
        "B",
        0,
        "The Factory",
        99,
        1.00,
        8,
        11,
        4,
        8,
        "https://lethal-company.fandom.com/wiki/Experimentation",
        6,
        155,
        230,
        333
    );

    static ASSURANCE = new moonMetainf(
        "220-Assurance",
        "place_holder_please_ignore",
        "Easy",
        "D",
        0,
        "The Factory",
        87,
        1.00,
        13,
        15,
        6,
        8,
        "https://lethal-company.fandom.com/wiki/Assurance",
        13,
        120,
        440,
        581
    );

    static VOW = new moonMetainf(
        "56-Vow",
        "place_holder_please_ignore",
        "Easy",
        "C",
        0,
        "The Factory",
        54,
        1.15,
        12,
        14,
        7,
        6,
        "https://lethal-company.fandom.com/wiki/Vow",
        13,
        120,
        408,
        563
    );

    static OFFENSE = new moonMetainf(
        "21-Offense",
        "place_holder_please_ignore",
        "Intermediate",
        "B",
        0,
        "The Mineshaft",
        60,
        1.25,
        14,
        17,
        12,
        8,
        "https://lethal-company.fandom.com/wiki/Offense",
        16,
        100,
        506,
        652
    );

    static MARCH = new moonMetainf(
        "61-March",
        "place_holder_please_ignore",
        "Intermediate",
        "B",
        0,
        "The Factory",
        100,
        2.00,
        13,
        16,
        14,
        12,
        "https://lethal-company.fandom.com/wiki/March",
        16,
        156,
        472.00,
        633.00

    );

    static ADAMANCE = new moonMetainf(
        "20-Adamance",
        "place_holder_please_ignore",
        "Intermediate",
        "B",
        0,
        "The Factory",
        67,
        1.18,
        16,
        18,
        13,
        13,
        "https://lethal-company.fandom.com/wiki/Adamance",
        16,
        120,
        562,
        738

    );

    static REND = new moonMetainf(
        "85-Rend",
        "place_holder_please_ignore",
        "Hard",
        "A",
        550,
        "The Mansion",
        85,
        1.80,
        18,
        25,
        10,
        6,
        "https://lethal-company.fandom.com/wiki/Rend",
        21,
        120,
        1054,
        1309
    );

    static DINE = new moonMetainf(
        "7-Dine",
        "place_holder_please_ignore",
        "Hard",
        "S",
        600,
        "The Mansion",
        67,
        1.80,
        200,
        249,
        16,
        7,
        "https://lethal-company.fandom.com/wiki/Dine",
        8,
        62,2639,
        2725
    );

    static TITAN = new moonMetainf(
        "8-Titan",
        "place_holder_please_ignore",
        "Hard",
        "S+",
        700,
        "The Factory",
        64,
        2.20,
        28,
        31,
        18,
        7,
        "https://lethal-company.fandom.com/wiki/Titan",
        13,
        92,
        1420,
        1511

    );

    static ARTIFICE = new moonMetainf(
        "68-Artifice",
        "place_holder_please_ignore",
        "Hard",
        "S++",
        1500,
        "The Mineshaft",
        50,
        1.80,
        26,
        30,
        13,
        13,
        "https://lethal-company.fandom.com/wiki/Artifice",
        19,
        156,
        1460,
        1818
    );

    static EMBRION = new moonMetainf(
        "5-Embrion",
        "place_holder_please_ignore",
        "Hard",
        "S",
        150,
        "The Factory",
        85,
        1.10,
        14,
        16,
        8,
        70,
        "https://lethal-company.fandom.com/wiki/Embrion",
        15,
        74,
        479,
        638
    );

    static LIQUIDATION = new moonMetainf(
        "44-Liquidation",
        "place_holder_please_ignore",
        "Hard",
        "S++",
        700,
        "The Mansion",
        72,
        1.60,
        28,
        44,
        13,
        13,
        "https://lethal-company.fandom.com/wiki/Liquidation",
        -1,
        -1,
        -1,
        -1
    );

    static metamap: { [key: string]: moonMetainf } = {
        "71": EnumMetainf.GORDION,
        "41": EnumMetainf.EXPERIMENTATION,
        "220": EnumMetainf.ASSURANCE,
        "56": EnumMetainf.VOW,
        "21": EnumMetainf.OFFENSE,
        "61": EnumMetainf.MARCH,
        "20": EnumMetainf.ADAMANCE,
        "85": EnumMetainf.REND,
        "7": EnumMetainf.DINE,
        "8": EnumMetainf.TITAN,
        "68": EnumMetainf.ARTIFICE,
        "5": EnumMetainf.EMBRION,
        "44": EnumMetainf.LIQUIDATION
    };
}