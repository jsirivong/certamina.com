import { useNavigate } from "react-router";
import { useThemeStore } from "../store/useThemeStore"
import { useUserStore } from "../store/useUserStore";

export default function Home() {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const { theme } = useThemeStore();

    return (
        <div className="h-screen overflow-y-auto space-y-44" data-theme={theme}>
            <div className="bg-purple-950 h-[80vh] flex items-center justify-center flex-col gap-y-28 p-7">
                <div className="space-y-4">
                    <h2 className="text-yellow-500 text-5xl font-bold max-w-3xl text-center">The reader and host you never knew you needed.</h2>
                    <p className="text-white text-xl font-semibold text-center underline underline-offset-7">- Certamina.com</p>
                </div>
                <div className="max-w-60 w-full flex flex-row justify-center items-center gap-x-10">
                    <button className={`w-full btn bg-purple-950 rounded-xl border-yellow-500 border-2 text-lg text-white shadow-lg shadow-purple-900 hover:bg-purple-800 ${user && "hidden"}`} onClick={() => navigate("/register")}>Register</button>
                    <button className="w-full btn bg-purple-950 rounded-xl border-yellow-500 border-2 text-lg text-white shadow-lg shadow-purple-900 hover:bg-purple-800" onClick={() => navigate("/join")}>Join a game</button>
                </div>
            </div>

            <div className="flex flex-col gap-y-48">
                <div className="bg-base-300 h-[60vh] p-32 grid grid-cols-2 mb-12 gap-x-20">
                    <div className="max-w-lg flex flex-col space-y-6">
                        <h2 className="font-bold text-3xl lg:text-5xl text-purple-600">Set up a game in seconds</h2>
                        <p className="text-md font-semibold">Host a competitive, real-like game of Certamen in just a few seconds with a maximum of 12 people.</p>
                        <button className="text-md btn btn-soft mt-auto">Host {">"}</button>
                    </div>
                    <div className="size-full">
                        <img src="/colosseum.png" />
                    </div>
                </div>

                <div className="bg-base-300 h-[60vh] p-32 grid grid-cols-2 mb-12 gap-x-20">
                    <div className="w-full h-full">
                        <img src="/colosseum.png" />
                    </div>
                    <div className="max-w-lg flex flex-col space-y-6">
                        <h2 className="font-bold text-3xl lg:text-5xl text-purple-600">Practice anywhere, everywhere, nonstop</h2>
                        <p className="font-semibold text-md">Doesn't matter where you are, Certamina sets you up in a simulated game of Certamen as many times as you want.</p>
                        <button className="text-md btn btn-soft mt-auto">Practice {">"} </button>
                    </div>
                </div>
            </div>
        </div>
    )
}