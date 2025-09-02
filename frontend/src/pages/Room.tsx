import PlayerCard from "../components/PlayerCard";
import { useEffect } from "react";
import { socket } from '../sockets/socket.ts'
import useTeams from "../hooks/useTeams.tsx";

export default function Room() {
    // const { code } = useParams();
    const { teams, setTeams } = useTeams();

    useEffect(() => {
        socket.on("player-join", (username: string) => {
            teams[0].players.push({username});
            setTeams({...teams});
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
                            <PlayerCard key={socket.id} username={val.username} />
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