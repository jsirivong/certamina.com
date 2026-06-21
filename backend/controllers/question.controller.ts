import type { Request, Response } from 'express';
import { pdfParse } from '../utils/pdf-parse.ts';

type Difficulty = "novice" | "intermediate" | "advanced";

interface Tournament {
    tournament: string;
    years: number[];
}

interface Question {
    number?: string;
    tossup: string;
    tossupAnswer: string;
    bonus1Question: string;
    bonus1Answer: string;
    bonus2Question: string;
    bonus2Answer: string;
}

const TOURNAMENTS: Tournament[] = [
    {
        tournament: "yale",
        years: [
            2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017
        ]
    },
    {
        tournament: "harvard",
        years: [
            2025, 2024, 2023, 2022, 2021, 2019, 2018, 2017, 2015, 2014
        ]
    },
    {
        tournament: "nationals",
        years: [
            2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010
        ]
    }
]

function parseSingle(number: string, body: string): Question | null {
    const pattern =
        /(.*?\?)\s*(.*?)\s*B1\s*:\s*(.*?\?)\s*(.*?)\s*B2\s*:\s*(.*?\?)\s*(.*)$/s;

    const m = pattern.exec(body);
    if (!m) return null;

    const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

    return {
        number,
        tossup: clean(m[1]),
        tossupAnswer: clean(m[2]),
        bonus1Question: clean(m[3]),
        bonus1Answer: clean(m[4]),
        bonus2Question: clean(m[5]),
        bonus2Answer: clean(m[6]),
    };
}

export const generateQuestions = async (req: Request, res: Response) => {
    const { difficulty, number }: { difficulty: Difficulty, number: number } = req.body;

    if (!difficulty || !number) {
        return res.status(400).json({ success: false, message: "Must provide both difficulty and number of questions." });
    }

    try {
        const randomTournament = TOURNAMENTS[Math.floor(Math.random() * TOURNAMENTS.length)];
        const randomYear = randomTournament.years[Math.floor(Math.random() * randomTournament.years.length)];

        const parsedText: string = (await pdfParse(randomTournament.tournament, randomYear, difficulty)).replace(/\s+/g, ' ').trim();

        const text = parsedText.replace(/\s+/g, ' ').trim();

        const parts = text.split(/(?<!\d)(\d+)\.\s+(?=[A-Z"\u201c\u2018'])/);

        const questions: Question[] = [];

        for (let i = 1; i < parts.length; i += 2) {
            const number = parts[i];
            const body = parts[i + 1].trim();
            const q = parseSingle(number, body);
            if (q) questions.push(q);
        }

        const randQuestion: Question = questions[Math.floor(Math.random() * questions.length)];

        res.status(200).json({ success: true, data: { tossup: randQuestion.tossup, answer: randQuestion.tossupAnswer, tournament: randomTournament.tournament[0].toUpperCase() + randomTournament.tournament.substring(1), year: randomYear}})
    } catch (err: any) {
        console.log("Error generating questions.", err);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}
