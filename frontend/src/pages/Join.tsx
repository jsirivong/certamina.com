import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { socket } from "../sockets/socket";
import { useThemeStore } from "../store/useThemeStore";
import useAuthentication from "../hooks/useAuthentication";

export default function Join() {
    const { theme } = useThemeStore();
    const [code, setCode] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            navigate(`/room/${code}`)
        } catch (err: any) {
            setError(err.response.data?.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div data-theme={theme} className="h-screen overflow-hidden">
            <div className="flex items-center justify-center">
                {error && (
                    <div className="alert alert-error z-50 absolute top-[100px] w-xl">
                        <span className="text-base-content/65 text-center">{error}</span>
                    </div>
                )}

                <img src="colosseum.png" className="h-screen mask-b-from-50% w-full blur-[5px]" />
                <div className="w-xs bg-base-100 rounded-lg p-5 absolute top-1/2 left-1/2 -translate-x-1/2">
                    <form className="flex flex-col justify-center gap-y-8" onSubmit={handleSubmit}>
                        <input type="text" placeholder="Code" className="input text-center font-semibold text-md w-full" value={code} onChange={e => setCode(e.target.value)} />
                        <button className="btn btn-soft text-md" type="submit">
                            {loading ?
                                <>
                                    <span className="loading loading-spinner loading-md"></span>
                                </> : "Join"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}