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
    min_power: number;
    max_power: number;
    more_info: string;
    constructor(name: string, description: string, difficulty: string, risk_level: string, cost: number, likely_layout: string, likely_layout_percentage: number, size: number, min_scrap: number, max_scrap: number, min_power: number, max_power: number, more_info: string) {
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
        this.min_power = min_power;
        this.max_power = max_power;
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
        "https://lethal-company.fandom.com/wiki/Gordion"
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
        "https://lethal-company.fandom.com/wiki/Experimentation"
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
        "https://lethal-company.fandom.com/wiki/Assurance"
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
        "https://lethal-company.fandom.com/wiki/Vow"
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
        "https://lethal-company.fandom.com/wiki/Offense"
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
        "https://lethal-company.fandom.com/wiki/March"
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
        "https://lethal-company.fandom.com/wiki/Adamance"
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
        "https://lethal-company.fandom.com/wiki/Rend"
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
        "https://lethal-company.fandom.com/wiki/Dine"
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
        "https://lethal-company.fandom.com/wiki/Titan"
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
        "https://lethal-company.fandom.com/wiki/Artifice"
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
        "https://lethal-company.fandom.com/wiki/Embrion"
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
        "https://lethal-company.fandom.com/wiki/Liquidation"
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