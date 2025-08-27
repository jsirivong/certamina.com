import { useEffect, useState } from "react"
import PageLoading from "../components/PageLoading";
import axios from "../services/axios";

type Difficulty = "Novice" | "Intermediate" | "Advanced";

export default function Practice() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);
    const [inPractice, setInPractice] = useState<boolean>(false);
    const [questions, setQuestions] = useState<number>(20);
    const [difficulty, setDifficulty] = useState<Difficulty>("Novice");

    useEffect(() => {
        (async () => {
            setLoading(true)

            try {
                const response = await axios.get("/practice/inpractice");

                if (response.data.success){
                    setInPractice(response.data.inpractice);
                    setError(null);
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

                const response = await axios.post("/practice");

                if (response.data.success) {
                    setError(null)
                }
            }
        } catch (err: any) {
            setError(err.response.data?.message);
        }
    }

    if (loading) {
        return <PageLoading />
    }

    return (
        <div className="h-screen p-20 flex items-center justify-center" data-theme="light">
            {!inPractice ? (<div className="w-full h-full shadow-2xl relative">
                <div className="p-6">
                    <a href="/" className="text-lg font-[Open Sans]">{"<"} Back</a>
                    <h1 className="text-center text-4xl font-bold font-[Open Sans]">Practice</h1>
                </div>

                <div className="max-w-screen w-full p-5">
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

                <div className="absolute top-full">
                    <button className="w-[50vw] btn btn-soft mx-auto text-center" onClick={handleSubmit}>Practice</button>
                </div>
            </div>) : (
                <div>
                    <div className="mx-auto relative top-[40vh]">
                        <button>
                            <img src="/emergency-stop.png" alt="Practice Buzzer" className="size-36 hover:cursor-pointer"/>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}