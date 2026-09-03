import { useNavigate } from "react-router";
import { useThemeStore } from "../store/useThemeStore"
import { useUserStore } from "../store/useUserStore";
import { MoveRight } from "lucide-react";

export default function Home() {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const { theme } = useThemeStore();

    return (
        <div className="h-screen overflow-y-auto space-y-44" data-theme={theme}>
            <div className="bg-base-100 h-[70vh] lg:h-[80vh] gap-y-28">
                <div className="bg-base-200 w-2xl h-[88vh] flex items-center">
                    <div className="w-full p-10 space-y-7">
                        <h1 className="font-light text-5xl text-left">Host exciting Certamen games in seconds<span className="animate-pulse font-thin">|</span></h1>
                        <p className="font-extralight">From just a few clicks, you can host and join a room anywhere in the world—whether from your house or at the other side of the world.</p>
                        <div className="w-full flex flex-row items-center space-x-10 container">
                            <button className="p-2 w-50 flex flex-row items-center justify-around bg-base-content/5 font-extralight rounded-sm hover:cursor-pointer hover:bg-base-100 hover:border-[0.25px] hover:border-purple-500">Host<MoveRight size={14}/></button>
                            <button className="border-[0.5px] p-2 w-50 flex flex-row items-center justify-around bg-base-content/5 rounded-sm font-extralight hover:bg-base-200 hover:cursor-pointer hover:border-yellow-200" onClick={() => navigate("/join")}>Join a Room<MoveRight size={14}/></button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}