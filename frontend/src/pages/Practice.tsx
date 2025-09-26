import { useEffect, useState } from "react"
import PageLoading from "../components/PageLoading";
import { useThemeStore } from "../store/useThemeStore";
import InPractice from "./InPractice";

type Difficulty = "Novice" | "Intermediate" | "Advanced";

export default function Practice() {
    const { theme } = useThemeStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);
    const [inPractice, setInPractice] = useState<boolean>(false);
    const [questions, setQuestions] = useState<number>(20);
    const [difficulty, setDifficulty] = useState<Difficulty>("Novice");

    useEffect(() => {
        (async () => {
            setLoading(true)

            try {
                if (localStorage.getItem("inpractice") === "true"){
                    setInPractice(true);
                } else {
                    setInPractice(false);
                }
            } catch (err: any) {
                setError(err.response.data?.message);
                console.log(error);
            } finally {
                setLoading(false);
            }
        })();
    }, [])

    const handleSubmit = async () => {
        try {
            if (!inPractice) {
                setInPractice(true);

                localStorage.setItem("inpractice", "true")
            }
        } catch (err: any) {
            setError(err.response.data?.message);
        }
    }

    const handleEndPractice = () => {
        localStorage.setItem("inpractice", "false");
        setInPractice(false);
    }

    if (loading) {
        return <PageLoading />
    }

    return (
        <div className="h-screen" data-theme={theme}>
            {!inPractice ? (<div className="w-full h-full shadow-2xl relative">
                <div className="p-6">
                    <a href="/" className="text-lg font-semibold font-[Open Sans]">{"<"} Back</a>
                    <h1 className="text-center text-4xl font-bold font-[Open Sans]">Practice</h1>
                </div>

                <div className="max-w-screen w-full px-20">
                    <div className="space-y-7">
                        <div className="flex flex-col">
                            <label className="input font-semibold">
                                <input type="number" placeholder="20" value={questions} onChange={(e) => setQuestions(Number(e.target.value))} disabled />
                                <span>Questions</span>
                            </label>
                        </div>
                        <div className="dropdown">
                            <label className="label mx-5">Difficulty</label>
                            <button className="btn btn-primary" tabIndex={0} role="button">
                                Select
                            </button>
                            <ul className="dropdown-content menu bg-base-100 z-1 p-2 w-52 shadow-sm" tabIndex={0}>
                                <li><button className="btn btn-ghost" onClick={() => setDifficulty("Novice")}>Novice</button></li>
                                <li><button className="btn btn-ghost" onClick={() => setDifficulty("Intermediate")}>Intermediate</button></li>
                                <li><button className="btn btn-ghost" onClick={() => setDifficulty("Advanced")}>Advanced</button></li>
                            </ul>
                            <span className="ml-18 label">{difficulty}</span>
                        </div>
                    </div>
                </div>

                <div className="flex mx-auto w-[30vw]">
                    <button className="mx-auto text-xl font-semibold font-[Open Sans] p-2 btn btn-soft w-full" onClick={handleSubmit}>Practice</button>
                </div>

            </div>) : (<InPractice questions={questions} difficulty={difficulty} handleEndPractice={handleEndPractice}/>)}
        </div>
    )
}