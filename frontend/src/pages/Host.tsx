import { useEffect, useState } from "react";
import { Link, Send } from "lucide-react";
import PlayerCard from "../components/PlayerCard";
import PlayerList from "../components/PlayerList";
import axios from "../services/axios";
import { useNavigate } from "react-router";
import PageLoading from "../components/PageLoading";
import useSocket from "../hooks/useSocket";
import { useLocation } from "react-router";

type Difficulty = "Novice" | "Intermediate" | "Advanced";

interface Message {
    id: string;
    text: string;
    username: string;
    created_at?: number;
    user_id?: string;
}

export interface Player {
    id?: string;
    username: string;
    score?: number;
    profile_picture?: string;
    joined_at?: number;
    socket_id?: string;
}

interface Team {
    id: number;
    name?: string;
    numberOfPlayers?: number;
    players: Player[];
}

export interface RoomData {
    code: string;
    hostId: string;
    players: Player[];
    status: "waiting" | "in_progress" | "ended";
    currentQuestion: number;
    created_at?: number;
}

type Role = "player" | "host";

export default function Host() {
    const [numberOfTossups, setNumberOfTossups] = useState<string>("20");
    const [readingSpeed, setReadingSpeed] = useState<string>("100")
    const [difficulty, setDifficulty] = useState<Difficulty | null>("Novice")
    const [diffMenuOpen, setDiffMenuOpen] = useState<boolean>(false);
    const [roomCode, setRoomCode] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatMessage, setChatMessage] = useState<string>("");
    const [teamsOn, setTeamsOn] = useState<boolean>(false);
    const [teamOne, setTeamOne] = useState<Team>({
        id: 1,
        name: "",
        players: []
    })
    const [teamTwo, setTeamTwo] = useState<Team>({
        id: 2,
        name: "",
        players: []
    })
    const [teamThree, setTeamThree] = useState<Team>({
        id: 3,
        name: "",
        players: []
    })

    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;

    const role: Role = state.role;

    const { socket, connected } = useSocket();

    useEffect(() => {
        if (!role) {
            console.log("Player has not joined the room.");
            navigate("/");
        }
    }, [role, navigate])

    useEffect(() => {   ``
        const chatBox = document.querySelector("#chat-box");

        if (!chatBox) return;

        chatBox.scrollTop = chatBox.scrollHeight;
    }, [messages])

    useEffect(() => {
        if (!socket || !connected) return;

        if (role === "host") {
            socket.emit("create-room", (response: any) => {
                if (response.success) {
                    const player = {
                        id: socket.id,
                        username: response.username
                    }

                    setRoomCode(response.code);
                    setTeamOne((prev) => ({ ...prev, players: [...prev.players, player] }))
                };
            });
        }

        socket.on("chat-message", (message: Message) => {
            setMessages((prev) => [...prev, message]);
        })

        socket.on("join-room", (data: {room: RoomData, code: number}) => {
            if (role !== "player"){
                return;
            }

            setRoomCode(data.code);

            
        })

        return () => {
            socket.off("chat-message");
            socket.off("create-room");
        }
    }, [socket, connected])

    const handleMessage = () => {
        if (!socket || !connected) return;

        socket.emit("chat-message", { chatMessage, roomCode })
        setChatMessage("");
    }

    if (!connected || !socket) {
        return <PageLoading />;
    }

    return (
        <div className="h-screen flex justify-between">
            <div className="container space-y-20 p-2 max-w-4xl">
                <div>
                    <div className="flex flex-row gap-x-2 min-h-60">
                        <PlayerList>
                            {teamOne.players.map((player: Player) => (
                                <PlayerCard username={player.username} key={player.id} />
                            )
                            )}
                        </PlayerList>
                        <PlayerList>
                            {teamTwo.players.map((player: Player) => (
                                <PlayerCard username={player.username} key={player.id} />
                            )
                            )}
                        </PlayerList>
                        <PlayerList>
                            {teamThree.players.map((player: Player) => (
                                <PlayerCard username={player.username} key={player.id} />
                            )
                            )}
                        </PlayerList>
                    </div>
                </div>
                {/* Chat */}
                <div className="flex flex-col gap-y-2">
                    <div id="chat-box" className="w-full bg-base-content/5 h-64 overflow-y-auto rounded-xl border-[0.5px] border-base-content/10 p-5">
                        {messages?.map((message: Message) => (
                            <div className="flex flex-row space-x-2 items-center mb-2" key={message.id}>
                                <div className="size-6">
                                    <img src="/avatar-placeholder.jpg" className="rounded-full" />
                                </div>
                                <h4 className="text-sm">{message.username}</h4>
                                <div className="chat-bubble">
                                    {message.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex items-center">
                        <input contentEditable aria-placeholder="Type a message for others to see." className="flex-1 bg-base-content/5 h-12 rounded-xl flex items-center p-3 border-[0.5px] border-base-content/10" onChange={(e) =>
                            setChatMessage(e.target.value)
                        } value={chatMessage} onKeyDown={(e) => {
                            if (e.code === "Enter") {
                                handleMessage();
                            }
                        }} />
                        <Send className="mx-5 hover:cursor-pointer text-base-content/50" size={20} onClick={handleMessage} />
                    </div>
                </div>
            </div>
            {/* Menu */}
            <div className="h-11/12 bg-base-200 m-2 max-w-3xl border-[0.5px] border-base-content/10 rounded-xl">
                <div className="flex flex-row gap-x-20 items-center justify-center m-4">
                    <button className="border-b-[1.5px] border-b-base-content/30 cursor-pointer text-xl tracking-wider">Settings</button>
                    <button className="border-b-[1.5px] border-b-base-content/30 cursor-pointer text-xl tracking-wider">Characters</button>
                </div>
                <h2 className="text-center m-5 mb-20 text-4xl"><span className="tracking-wider">Code</span>: <span className="tracking-widest">{roomCode}</span></h2>

                <div className="flex flex-col gap-y-3 p-6">
                    <div className="flex items-center gap-x-7">
                        <span className="text-sm font-semibold tracking-wide">Tossups: </span>
                        <div className="flex items-center gap-x-1">
                            <span className="text-sm bg-base-content/10 px-2 py-1 rounded">{numberOfTossups}</span>
                            <input className="w-2xs h-8 accent-green-300" defaultValue={20} type="range" min={"5"} max={"30"} step={"1"} onChange={(e) => setNumberOfTossups(e.target.value)} />
                        </div>
                    </div>

                    <div className="flex items-center gap-x-7">
                        <span className="text-sm font-semibold tracking-wide">Reading Speed (WPM): </span>
                        <div className="flex items-center gap-x-1">
                            <span className="text-sm bg-base-content/10 px-2 py-1 rounded">{readingSpeed}</span>
                            <input className="w-2xs h-8" defaultValue={100} type="range" min={"70"} max={"400"} step={"1"} onChange={(e) => setReadingSpeed(e.target.value)} />
                        </div>
                    </div>

                    <div className="flex items-center gap-x-7">
                        <span className="text-sm font-semibold tracking-wide">Difficulty: </span>
                        <span className="w-xs text-sm border-[0.5px] font-semibold tracking-wide border-base-content/10 py-2 px-3 rounded cursor-pointer" onClick={() => setDiffMenuOpen(!diffMenuOpen)}>{difficulty}</span>
                    </div>

                    {diffMenuOpen && (
                        <div className="relative left-22 w-3xs z-10 h-auto bg-base-300 rounded-md">
                            {["Novice", "Intermediate", "Advanced"].map((buttonDiff: string) => (
                                <button key={buttonDiff} onClick={() => {
                                    setDiffMenuOpen(false)
                                    setDifficulty(buttonDiff as Difficulty)
                                }}
                                    className={`w-full text-sm py-2 rounded-md cursor-pointer font-semibold tracking-wide ${buttonDiff === difficulty ? "bg-base-100" : "bg-base-300"}`}>
                                    {buttonDiff}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-row mt-auto items-center justify-center space-x-5">
                    <button className="text-2xl tracking-tight bg-base-content/5 rounded w-3xs h-12 cursor-pointer">
                        Start
                    </button>
                    <Link className="cursor-pointer" />
                </div>
            </div>
        </div>
    )
}