import { useEffect, useRef, useState } from "react";
import { Link, Send } from "lucide-react";
import PlayerCard from "../components/PlayerCard";
import axios from "../services/axios";
import { useNavigate } from "react-router";
import PageLoading from "../components/PageLoading";
import useSocket from "../hooks/useSocket";
import { useLocation } from "react-router";
import useAuthentication from "../hooks/useAuthentication";

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
    username: string | undefined;
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
    teams: Team[];
    status: "waiting" | "in_progress" | "ended";
    currentQuestion: number;
    created_at?: number;
}

type Role = "player" | "host";

export default function Room() {
    const [numberOfTossups, setNumberOfTossups] = useState<string>("20");
    const [readingSpeed, setReadingSpeed] = useState<string>("100")
    const [difficulty, setDifficulty] = useState<Difficulty | null>("Novice")
    const [diffMenuOpen, setDiffMenuOpen] = useState<boolean>(false);
    const [roomCode, setRoomCode] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatMessage, setChatMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [teams, setTeams] = useState<Team[]>([
        { id: 1, name: "Team 1", players: [] },
        { id: 2, name: "Team 2", players: [] },
        { id: 3, name: "Team 3", players: [] },
    ]);

    const location = useLocation();
    const state = location.state;

    const role: Role = state?.role;

    const { socket, connected } = useSocket();
    const { user } = useAuthentication();

    useEffect(() => {
        const onConnect = () => {
            if (sessionStorage.getItem("roomcode") && sessionStorage.getItem("username")) {
                socket.emit("rejoin-room", sessionStorage.getItem("roomcode"), sessionStorage.getItem("username"), (response: any) => {
                    setTeams(response.data.room.teams);
                    setRoomCode(response.data.room.code);
                });
            }
        }

        socket.on("connect", onConnect);

        socket.on("chat-message", (message: Message) => {
            setMessages((prev) => [...prev, message]);
        })

        socket.on("join-room", (data: { room: RoomData }) => {
            console.log("join room");
            setTeams(data.room.teams);
            setRoomCode(data.room.code);
        })

        socket.on("leave-room", (room: RoomData) => {
            setTeams(room.teams);
        })

        return () => {
            socket.off("chat-message");
            socket.off("join-room");
            socket.off("leave-room");
        }
    }, [])

    useEffect(() => {
        if (role === "player") {
            socket.emit("join-room", { code: sessionStorage.getItem("roomcode"), username: "Player" }, (response: any) => {
                if (response.data.success) {
                    setTeams(response.data.room.teams);
                    setRoomCode(response.data.room.code);
                }
            })
        }
    }, [role])

    useEffect(() => {
        const chatBox = document.querySelector("#chat-box");

        if (!chatBox) return;

        chatBox.scrollTop = chatBox.scrollHeight;
    }, [messages])

    useEffect(() => {
        if (!socket || !connected) return;
        if (role !== "host") return;

        if (!sessionStorage.getItem("roomcode")) {
            socket.emit("create-room", user, (response: any) => {
                if (response.success) {
                    setRoomCode(response.code);
                    setTeams(response.teams);
                    sessionStorage.setItem("roomcode", response.code);
                    sessionStorage.setItem("username", user?.username as string);
                };
            });
        } else {
            setLoading(true);
            setRoomCode(sessionStorage.getItem("roomcode"));

            (async () => {
                try {
                    const response = await axios.get(`/room/status/${sessionStorage.getItem("roomcode")}`);

                    if (response.data.success && response.data.room) {
                        let totalAmountOfPlayers: number = 0;

                        response.data.room.teams.forEach((team: Team) => {
                            totalAmountOfPlayers += team.players.length;
                        })

                        if (totalAmountOfPlayers > 1) {
                            setTeams(response.data.room.teams);
                        } else {
                            sessionStorage.removeItem("roomcode");
                            socket.emit("create-room", user, (response: any) => {
                                if (response.success) {
                                    setRoomCode(response.code);
                                    setTeams(response.teams);
                                    sessionStorage.setItem("roomcode", response.code);
                                };
                            });
                        }
                    }
                } catch (err: any) {
                    console.log(err);
                } finally {
                    setLoading(false);
                }
            })()
        }
    }, [socket, connected])

    const handleMessage = () => {
        if (!socket || !connected) return;

        socket.emit("chat-message", { chatMessage, roomCode })
        setChatMessage("");
    }

    return (
        <div className="h-screen flex justify-between">
            <div className="container space-y-20 p-2 max-w-4xl">
                <div>
                    <div className="grid grid-cols-3 gap-x-8 pt-2">
                        <h2 className="text-center font-semibold pb-2 text-lg">{teams[0].name}</h2>
                        <h2 className="text-center font-semibold pb-2 text-lg">{teams[1].name}</h2>
                        <h2 className="text-center font-semibold pb-2 text-lg">{teams[2].name}</h2>
                    </div>
                    <div className="container grid gap-x-8 grid-cols-3 min-h-46">
                        <div className="flex flex-col space-y-3 p-1">
                            {teams[0].players.map((player: Player) => (
                                <PlayerCard username={player.username} key={player.socket_id} />
                            ))}
                        </div>
                        <div className="flex flex-col space-y-3 p-1">
                            {teams[1].players.map((player: Player) => (
                                <PlayerCard username={player.username} key={player.socket_id} />
                            ))}
                        </div>
                        <div className="flex flex-col space-y-3 p-1">
                            {teams[2].players.map((player: Player) => (
                                <PlayerCard username={player.username} key={player.socket_id} />
                            ))}
                        </div>
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