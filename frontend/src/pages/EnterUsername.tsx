import { useState, useEffect, type FormEvent } from "react"
import axios from "../services/axios.ts";
import { useNavigate, useSearchParams } from "react-router";
import useSocket from "../hooks/useSocket.tsx";

export default function EnterUsername() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [username, setUsername] = useState<string>("");
    const navigate = useNavigate();
    const { socket, connected } = useSocket();

    useEffect(() => {
        try {
            (async () => {
                const response = await axios.post(`/room/status/${searchParams.get("code")}`)

                if (!response.data.success || !response.data.exists) {
                    navigate("/join");
                }
            })()
        } catch (err: any) {
            console.log("Error in accessing username page.");
        }
    }, [])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (!socket || !connected) return;

            socket.emit("join-room", {code: searchParams.get("code"), username: username}, (response: any) => {
                if (response.success){
                    navigate("/room", {state: {role: "player", players: response.room.players}});
                }
            });
        } catch (err: any){
            console.log("Error joining room.");
        }
    }

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="w-lg h-60 bg-base-300 rounded-2xl border-[0.5px] border-base-content/10">
                <h2 className="text-center text-3xl tracking-wide m-5">Username</h2>
                <form className="flex flex-col items-center justify-center space-y-12 m-8" onSubmit={handleSubmit}>
                    <input className="text-xl tracking-wide w-md h-10 bg-base-content/5 rounded-lg p-2 border-[0.5px] border-base-content/50" type="text" onChange={
                        (e) => setUsername(e.target.value)
                    } value={username}></input>
                    <button type="submit" className="w-2xs h-10 bg-base-200 rounded-lg text-lg cursor-grab border-[0.5px] border-base-content/50">Enter</button>
                </form>
            </div>
        </div>
    )
}