import axios from "../services/axios.ts";

interface TossupData {
    tossup: string;
    answer: string;
    tournament: string;
    year: string;
}

export const generateQuestions = async (difficulty: "novice" | "intermediate" | "advanced", numberOfQuestions: number) => {
    try {
        const response = await axios.post("/questions/generate-questions", { difficulty: difficulty, number: numberOfQuestions });

        if (response.data.success) {
            const tossupData: TossupData = {
                tossup: response.data.data.tossup,
                answer: response.data.data.answer,
                tournament: response.data.data.tournament,
                year: response.data.data.year
            }

            return tossupData;
        }
    } catch (e: any) {
        console.error("Error in reading question: ", e);
    }
}