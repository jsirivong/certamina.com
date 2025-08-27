import { useState } from "react"

interface Player {
    id?: string;
    username: string;
    profile_picture?: string;
}

interface Team {
    id: number;
    name: string;
    score: number;
    players: Player[];
}

export default function useTeams(){
    const [ teams ] = useState<Team[]>([
        {
            id: 1,
            name: "Team 1",
            score: 0,
            players: [
                {
                    username: "Devin"
                }
            ]
        },
        {
            id: 2,
            name: "boomshakalaka",
            score: 0,
            players: []
        },
        {
            id: 3,
            name: "Team 3",
            score: 0,
            players: []
        }
    ]);
    
    return { teams }
}