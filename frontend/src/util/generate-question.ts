import axios from "../services/axios.ts";

interface TossupData {
    number?: string;
    tossup: string;
    tossupAnswer: string;
    bonus1Question: string;
    bonus1Answer: string;
    bonus2Question: string;
    bonus2Answer: string;
    tournament: string;
    year: string;
}

export const generateQuestions = async (difficulty: "Novice" | "Intermediate" | "Advanced", numberOfQuestions: number) => {
    try {
        const response = await axios.post("/questions/generate-questions", { difficulty: difficulty.toLowerCase(), number: numberOfQuestions });

        if (response.data.success) {
            const tossupData: TossupData = {
                tossup: response.data.data.question.tossup,
                tossupAnswer: response.data.data.question.tossupAnswer,
                bonus1Question: response.data.data.question.bonus1Question,
                bonus1Answer: response.data.data.question.bonus1Answer,
                bonus2Question: response.data.data.question.bonus2Question,
                bonus2Answer: response.data.data.question.bonus2Answer,
                tournament: response.data.data.tournament,
                year: response.data.data.year
            }

            return tossupData;
        }
    } catch (e: any) {
        console.error("Error in reading question: ", e);
    }
}