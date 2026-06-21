import { useEffect, useState, type FormEvent } from "react"
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
    const [infiniteTossups, setInfiniteTossups] = useState<boolean>(true);
    const [bonuses, setBonuses] = useState<boolean>(false);

    const [PDF, setPDF] = useState<File | null>(null);
    const [score, setScore] = useState<number>(Number(localStorage.getItem("score")) || 0)

    useEffect(() => {
        (async () => {
            setLoading(true)

            try {
                if (localStorage.getItem("inpractice") === "true") {
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

    const handleFileChange = (e: FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        const target = e.target as HTMLInputElement & {
            files: FileList;
        }

        setPDF(target.files[0])
    }

    if (loading) {
        return <PageLoading />
    }

    if (inPractice) {
        return <InPractice questions={questions} difficulty={difficulty} infiniteTossups={infiniteTossups} bonuses={bonuses} handleEndPractice={handleEndPractice} />
    }

    return (
        <div className="h-screen flex items-center justify-center" data-theme={theme}>
            <div className="w-full h-full shadow-2xl relative">
                <div className="p-6">
                    <a href="/" className="text-lg font-semibold font-[Open Sans]">{"<"} Back</a>
                    <h1 className="text-center text-4xl font-bold font-[Open Sans]">Practice</h1>
                </div>

                <div className="max-w-screen w-full px-20">
                    <div className="space-y-5">
                        <div className="flex flex-col">
                            <label className="input font-semibold">
                                <input type="number" placeholder="20" value={questions} onChange={(e) => setQuestions(Number(e.target.value))} disabled={infiniteTossups}/>
                                <span>Questions</span>
                            </label>
                        </div>
                        <div className="flex flex-row gap-x-5">
                            <label className="label">Infinite tossups</label>
                            <input className="checkbox border-2 rounded-none" type="checkbox" checked={infiniteTossups} onChange={(e) => setInfiniteTossups(e.target.checked)}/>
                        </div>
                        <div className="flex flex-row gap-x-5">
                            <label className="label">Bonuses</label>
                            <input className="checkbox border-2 rounded-none" type="checkbox" checked={bonuses} onChange={(e) => setBonuses(e.target.checked)}/>
                        </div>
                        <div className="dropdown">
                            <label className="label mx-5">Difficulty</label>
                            <button className="border-[0.5px] border-base-content/15 w-32 h-8 rounded-lg cursor-grab" tabIndex={0} role="button">
                                Select
                            </button>
                            <ul className="dropdown-content menu bg-base-300 z-1 p-2 w-52 shadow-sm rounded-lg" tabIndex={0}>
                                <li><button className="btn btn-ghost" onClick={() => setDifficulty("Novice")}>Novice</button></li>
                                <li><button className="btn btn-ghost" onClick={() => setDifficulty("Intermediate")}>Intermediate</button></li>
                                <li><button className="btn btn-ghost" onClick={() => setDifficulty("Advanced")}>Advanced</button></li>
                            </ul>
                            <span className="ml-18 label">{difficulty}</span>
                        </div>
                        {/* <div className="flex flex-col space-y-1" onChange={handleFileChange}>
                            <label className="label">
                                Select PDF:
                            </label>
                            <input className="file-input" type="file" accept="application/pdf" />
                        </div> */}
                    </div>
                </div>

                <div className="flex mx-auto w-[30vw]">
                    <button className="mx-auto text-xl font-semibold font-[Open Sans] p-2 btn btn-soft w-full" onClick={handleSubmit}>Practice</button>
                </div>
            </div>
        </div>
    )
}