import { useState } from "react";

interface IProps {
    questions?: number;
    difficulty: "Novice" | "Intermediate" | "Advanced";
    handleEndPractice: () => void;
}

export default function InPractice({ difficulty, handleEndPractice }: IProps) {
    const [tossupQuestion] = useState<number>(1);
    const [showBuzz, setShowBuzz] = useState<boolean>(true);
    const [showTextbox, setShowTextbox] = useState<boolean>(false);
    const [ question ] = useState("What daughters of Achelous may have been attendants of Persephone, resided on the island ofAnthemoessa, and forced Odysseus’s men to use wax to not be drowned by their deadly song?");
    // const [ timer, setTimer ] = useState<number>(10);

    const handleBuzz = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setShowTextbox(true);
        setShowBuzz(false);
    }

    return (
        <div className="h-screen">
            <button className="btn btn-soft rounded-2xl border-2 bg-base-100 left-0 absolute m-5" onClick={handleEndPractice}>End Practice</button>
            {showBuzz && (
                <button className="btn btn-soft rounded-2xl border-2 bg-base-100 top-11/12 absolute left-1/2 -translate-x-1/2" onClick={handleBuzz}>Buzz</button>
            )}
            <div className="mx-auto max-w-5xl flex flex-row justify-center gap-5 relative top-0 my-5">
                <h4 className="text-md font-semibold text-center w-20">{difficulty}</h4>
                <h4 className="text-mid font-semibold text-center w-20">Toss Up {tossupQuestion}</h4>
            </div>
            <div className="w-5xl h-auto p-12 text-left text-2xl mx-auto">
                {question}
            </div>
            {showTextbox && (
                <div className="flex flex-col gap-y-5">
                    <input className="relative left-1/2 -translate-x-1/2 border rounded h-10 p-3 w-2xl" />
                    <button className="btn btn-soft w-sm mx-auto">
                        Send
                    </button>
                </div>
            )}
        </div>
    )
}
