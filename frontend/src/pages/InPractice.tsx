import { useState } from "react";

interface IProps {
    questions: number;
    difficulty: "Novice" | "Intermediate" | "Advanced";
    handleEndPractice: () => void;
}

export default function InPractice({ questions, difficulty, handleEndPractice }: IProps) {
    const [ tossupQuestion, setTossupQuestion ] = useState<number>(1);

    return (
        <div className="h-screen">
            <button className="btn btn-soft rounded-2xl border-2 bg-base-100 left-8 top-27 absolute" onClick={handleEndPractice}>End Practice</button>
            <button className="mx-auto top-full -translate-y-12/12 p-10 relative">
                <img src="/emergency-stop.png" alt="Practice Buzzer" className="size-32 hover:cursor-pointer" />
            </button>
            <div className="mx-auto max-w-5xl flex flex-row justify-center gap-5 relative -top-28">
                <h4 className="text-md font-semibold text-center w-20">{difficulty}</h4>
                <h4 className="text-mid font-semibold text-center w-20">Toss Up {tossupQuestion}</h4>
            </div>
        </div>
    )
}