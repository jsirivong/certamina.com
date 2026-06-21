import { useEffect, useState, useRef } from "react";
import { generateQuestions } from "../util/generate-question.ts";

interface IProps {
    questions?: number;
    difficulty: "Novice" | "Intermediate" | "Advanced";
    bonuses?: boolean;
    infiniteTossups?: boolean | undefined;
    handleEndPractice: () => void;
}

interface TossupData {
    tossup: string;
    answer: string;
    tournament: string;
    year: string;
}

type GameState = "Generating Question" | "Reading Question" | "Answering Question" | "Showing Answer";

export default function InPractice({ questions, difficulty, handleEndPractice, bonuses, infiniteTossups }: IProps) {
    const tossup = useRef<string>("");
    const answer = useRef<string>("");
    const readInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    const [input, setInput] = useState<string>("");
    const [tossupQuestion, setTossupQuestion] = useState<number>(1);
    const [bonus, setBonus] = useState<number>(1);
    const [answeringBonus, setAnsweringBonus] = useState<boolean>(false);
    const [showBuzz, setShowBuzz] = useState<boolean>(true);
    const [showTextbox, setShowTextbox] = useState<boolean>(false);
    const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false);
    const [showTimer, setShowTimer] = useState<boolean>(false);
    const [timer, setTimer] = useState("10");
    const [tossupText, setTossupText] = useState<string>("");
    const [practiceState, setPracticeState] = useState<GameState | null>(null);
    const [tournament, setTournament] = useState<string>("");
    const [year, setYear] = useState<string>();

    const generateTossup = async (): Promise<string | undefined> => {
        const tossupData: TossupData | undefined = await generateQuestions(difficulty, 1);

        if (!tossupData) return;

        if (tossupData.tournament && tossupData.year){
            setTournament(tossupData.tournament);
            setYear(tossupData.year);
        }

        if (tossupData.tossup && tossupData.answer) {
            tossup.current = tossupData.tossup;
            answer.current = tossupData.answer;
        }
        
        setPracticeState("Reading Question");
        return tossupData?.tossup
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space" && practiceState === "Reading Question") {
                setPracticeState("Answering Question");
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        // demounts
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [practiceState]);

    useEffect(() => {
        setPracticeState("Generating Question");
    }, []);

    useEffect(() => {
        if (practiceState === "Generating Question") {
            generateTossup();
        }
        else if (practiceState === "Reading Question") {
            readTossup(tossup.current);
        } else if (practiceState == "Answering Question") {
            handleBuzz();
        } else if (practiceState == "Showing Answer") {
            if (timerInterval.current) {
                clearInterval(timerInterval.current)
                timerInterval.current = null;
            }
            setShowCorrectAnswer(true);
        }
    }, [practiceState])

    const startTimer = () => {
        if (!timerInterval.current) {
            setTimer("10");
            const startTime = Date.now();

            timerInterval.current = setInterval(() => {
                const elapsedTime = (Date.now() - startTime) / 1000
                if (elapsedTime >= 10) {
                    setPracticeState("Showing Answer");
                }
                setTimer((10 - elapsedTime).toFixed(2));
            }, 1)
        }
    }

    const moveToNextQuestion = () => {
        setInput("");
        setShowCorrectAnswer(false);
        setShowTextbox(false);
        setShowBuzz(true);
        setShowTimer(false);
        timerInterval.current = null;

        setPracticeState("Generating Question");
    }

    const handleBuzz = () => {
        setShowTextbox(true);
        setShowBuzz(false);
        setShowTimer(true);
        startTimer();
        if (readInterval.current) {
            clearInterval(readInterval.current);
        }

        setPracticeState("Answering Question")
    }

    const readTossup = (tossup: string) => {
        const wordArray = tossup.split(" ");
        setTossupText("");

        let index = 0;
        readInterval.current = setInterval(() => {
            if (index < wordArray.length) {
                const currentWord = wordArray[index];
                setTossupText((prev) => prev + (prev ? " " : "") + currentWord);
                index++;
            } else {
                setPracticeState("Answering Question");
                if (readInterval.current) {
                    clearInterval(readInterval.current);
                }
            }
        }, 300);
    }

    return (
        <div className="h-screen overflow-y-hidden">
            <button className="btn btn-soft rounded-2xl border-2 bg-base-100 left-0 absolute m-5" onClick={handleEndPractice}>End Practice</button>
            {showBuzz && (
                <div className="top-11/12 absolute left-1/2 -translate-x-1/2 max-w-3xl flex flex-col">
                    <button className="btn btn-soft rounded-2xl border-2 bg-base-100" onClick={handleBuzz}>
                        Buzz
                    </button>
                    <p className="text-base-content/50 text-xs mt-1">Space to Buzz</p>
                </div>
            )}
            <div className="mx-auto max-w-5xl flex flex-row justify-center gap-5 relative top-0 my-5">
                <h4 className="text-md font-semibold text-center w-20">{difficulty}</h4>
                <h4 className="text-md font-semibold text-center w-30">{tournament} {year}</h4>
                {!infiniteTossups && (
                    <>
                        <h4 className="text-mid font-semibold text-center w-25">Toss Up {tossupQuestion}/{questions}</h4>
                        {answeringBonus && (
                            <h4 className="text-mid˝ font-semibold text-center w-25">Bonus {bonus}/2</h4>
                        )}
                    </>
                )}
            </div>
            <div className="w-5xl h-auto p-12 text-left text-2xl mx-auto">
                {tossupText}
            </div>
            {showTextbox && (
                <div className="flex flex-col gap-y-5">
                    <input className="relative left-1/2 -translate-x-1/2 border rounded h-10 p-3 w-2xl" autoFocus onChange={(e) => setInput(e.target.value)} value={input} disabled={showCorrectAnswer} onKeyDown={(e) => {
                        if (e.code === "Enter") {
                            setPracticeState("Showing Answer");
                        }
                    }} />
                    <button className="btn btn-soft w-sm mx-auto" onClick={() => {
                        setPracticeState("Showing Answer");
                    }} disabled={showCorrectAnswer}>
                        Send
                    </button>
                </div>
            )}
            {practiceState === "Showing Answer" && (
                <div className="mx-auto mt-8 flex flex-col max-w-xs gap-y-4">
                    <p className="text-center text-lg">Answer: <span className="font-semibold">{answer.current}</span></p>
                    <button className="btn btn-ghost" onClick={moveToNextQuestion}>Continue {">"}</button>
                </div>
            )}
            {practiceState === "Answering Question" && (
                <div className="m-20">
                    <p className="text-center text-3xl">{timer}</p>
                </div>
            )}
        </div>
    )
}
