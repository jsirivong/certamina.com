import { useNavigate } from "react-router";
import { useThemeStore } from "../store/useThemeStore"
import { useUserStore } from "../store/useUserStore";
import { AudioLines, Camera, MoveRight, SlidersHorizontal, UsersRound } from "lucide-react";
import FadeIn from "../components/FadeIn.tsx";

export default function Home() {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const { theme } = useThemeStore();

    return (
        <div data-theme={theme}>
            <div className="bg-base-300 lg:w-2xl w-full h-[88vh] flex items-center">
                <div className="w-full p-10 space-y-7">
                    <h1 className="font-light text-5xl text-left">Host exciting Certamen games in seconds<span className="animate-pulse font-thin">|</span></h1>
                    <p className="font-extralight">From just a few clicks, you can host and join a room anywhere in the world—whether from your house or at the other side of the world.</p>
                    <div className="w-full flex flex-row items-center space-x-10 container">
                        <button className="p-2 w-50 flex flex-row items-center justify-around bg-base-content/5 font-extralight rounded-sm hover:cursor-pointer hover:bg-purple-400">Host<MoveRight size={14} /></button>
                        <button className="border-[0.5px] p-2 w-50 flex flex-row items-center justify-around bg-base-content/5 rounded-sm font-extralight hover:bg-base-200 hover:cursor-pointer hover:border-yellow-200" onClick={() => navigate("/join")}>Join a Room<MoveRight size={14} /></button>
                    </div>
                </div>
            </div>

            <FadeIn>
                <div className="w-full h-[16vh] bg-base-300 lg:grid grid-cols-[4fr] p-5 hidden" >
                    <div className="flex flex-row items-center gap-x-36">
                        <div className="flex flex-row items-center gap-x-4">
                            <UsersRound />
                            <div>
                                <h2 className="font-semibold whitespace-nowrap">Maximum Capacity</h2>
                                <p className="text-left font-thin text-sm">Capacity of 12.</p>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-x-4">
                            <SlidersHorizontal />
                            <div>
                                <h2 className="font-semibold whitespace-nowrap">Game Settings</h2>
                                <p className="text-left font-thin text-sm">10+</p>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-x-4">
                            <AudioLines />
                            <div>
                                <h2 className="font-semibold">Text-To-Speech</h2>
                                <p className="text-left font-thin text-sm">Incorporate text-to-speech to your games.</p>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-x-4">
                            <Camera />
                            <div>
                                <h2 className="font-semibold">Customizable Profiles</h2>
                                <p className="text-left font-thin text-sm">Customize your profiles with famous Latin figures.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </FadeIn>

            <FadeIn threshold={0.4}>
                <div className="relative h-[107vh]">
                    <img src="stockphoto.jpg" className="w-full opacity-5 absolute" />
                    <div className="relative z-10 left-20 top-50 space-y-8 max-w-sm">
                        <h1 className="relative text-6xl font-light">Practice</h1>
                        <p className="text-lg font-thin">Challenge your thinking and test your knowledge with the different categories for extra practice—whether it be for a local certamen in your area or at Nationals.</p>
                        <button className="border-1 rounded-xl p-2 w-3xs hover:cursor-pointer hover:border-2 hover:bg-base-300" onClick={() => navigate("/practice")}>Practice</button>
                    </div>
                </div>
            </FadeIn>

            {/* <FadeIn>
                <div className="flex justify-center">
                     <hr className="border-t border-gray-300 my-10 w-[50vw] " />
                </div>
            </FadeIn>

            <FadeIn threshold={0.4}>
                <div className="w-full h-[40vh] bg-base-300">
                    
                </div>
            </FadeIn> */}
        </div>
    )
}