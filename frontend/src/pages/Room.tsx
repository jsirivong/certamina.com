import PlayerCard from "../components/PlayerCard";
import { useEffect } from "react";
import { socket } from '../sockets/socket.ts'
import useTeams from "../hooks/useTeams.tsx";

export default function Room() {
    // const { code } = useParams();
    const { teams } = useTeams();

    useEffect(() => {
        socket.on("joinRoom", (player: { id?: number | string, username: string, profile_picture?: string }) => {
            console.log(player)
        })
    }, [])

    return (
        <div data-theme="light" className="h-screen">
            <div className="max-h-screen bg-base-100 p-2 absolute top-26 grid grid-cols-3 gap-5">
                <div className="bg-base-200 w-xs rounded-xl">
                    <div className="m-3">
                        <h1 className="text-2xl font-bold text-center">{teams[0].name}</h1>
                    </div>
                    <ul className="list gap-y-2">
                        {teams[0].players.map((val) => (
                            <PlayerCard key={Date.now()} username={val.username} />
                        ))}
                    </ul>
                </div>
                <div className="bg-base-200 w-xs rounded-xl">
                    <div className="m-3">
                        <h1 className="text-2xl font-bold text-center">{teams[1].name}</h1>
                    </div>
                </div>
                <div className="bg-base-200 w-xs rounded-xl">
                    <div className="m-3">
                        <h1 className="text-2xl font-bold text-center">{teams[2].name}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}