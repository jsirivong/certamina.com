import { useState, type FormEvent } from "react";
import Navbar from "../components/Navbar";
import axios from "../services/axios";
import { useNavigate } from "react-router";
import io from 'socket.io-client';
import { joinRoom } from "../sockets/emitters/roomEmitters";
import useAuthentication from "../hooks/useAuthentication";

export default function Join() {
    const [code, setCode] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`/room/${code}/join`);

            if (response.data.success) {
                // navigate("/join/username")
                const { user } = useAuthentication();

                if (user) {
                    navigate(`/room/${response.data.code}`)
                    setCode("");
                    setError(null);
                    joinRoom({ username: user?.username, id: user?.id }, response.data.code)
                }
            }
        } catch (err: any) {
            setError(err.response.data?.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div data-theme="light">
            <div className="h-screen flex items-center justify-center">
                {error && (
                    <div className="alert alert-error z-50 absolute top-[100px] w-xl">
                        <span className="text-base-content/65 text-center">{error}</span>
                    </div>
                )}

                <img src="colosseum.png" className="h-full w-full blur-[5px]" />
                <div className="w-xs bg-base-100 rounded-lg p-5 absolute top-1/2 left-1/2 -translate-x-1/2">
                    <form className="flex flex-col justify-center gap-y-8" onSubmit={handleSubmit}>
                        <input type="text" placeholder="Code" className="input text-center font-semibold w-full" value={code} onChange={e => setCode(e.target.value)} />
                        <button className="btn btn-soft" type="submit">
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