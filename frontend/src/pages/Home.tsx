import { useNavigate } from "react-router";
import { useThemeStore } from "../store/useThemeStore"
import { useUserStore } from "../store/useUserStore";

export default function Home() {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const { theme } = useThemeStore();

    return (
        <div className="h-screen overflow-y-auto space-y-44" data-theme={theme}>
            <div className="bg-purple-950 h-[70vh] lg:h-[80vh] flex items-center justify-center flex-col gap-y-28 p-7">
                <div className="space-y-4">
                    <h2 className="text-yellow-500 md:text-5xl text-3xl font-bold max-w-3xl text-center">The reader and host you never knew you needed.</h2>
                    <p className="text-white text-xl font-semibold text-center underline underline-offset-7">- Certamina.com</p>
                </div>
                <div className="max-w-60 w-full flex sm:flex-row flex-col gap-y-5 justify-center items-center gap-x-10">
                    <button className={`w-full btn bg-purple-950 rounded-xl border-yellow-500 border-2 text-lg text-white shadow-lg shadow-purple-900 hover:bg-purple-800 ${user && "hidden"}`} onClick={() => navigate("/register")}>Register</button>
                    <button className="w-full btn bg-purple-950 rounded-xl border-yellow-500 border-2 text-lg text-white shadow-lg shadow-purple-900 hover:bg-purple-800" onClick={() => navigate("/join")}>Join a game</button>
                </div>
            </div>

            <div className="flex flex-col items-center gap-y-48 p-10">
                <div className="grid grid-cols-2 bg-base-300 h-[70vh] p-20 w-full gap-x-20">
                    <div className="max-w-[70vw] flex flex-col space-y-6 mx-auto justify-center">
                        <h2 className="font-bold text-3xl lg:text-5xl text-purple-600">Set up a game in seconds</h2>
                        <p className="text-md font-semibold">Host a competitive, real-like game of Certamen in just a few seconds with a maximum of 12 people.</p>
                        <button className="btn btn-soft w-full">Host {">"}</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 bg-base-300 h-[70vh] p-20 w-full gap-x-20">
                    <div className="max-w-[70vw] flex flex-col space-y-6 mx-auto justify-center">
                        <h2 className="font-bold text-3xl lg:text-5xl text-purple-600">Practice anywhere, everywhere, nonstop</h2>
                        <p className="text-md font-semibold">Doesn't matter where you are, Certamina sets you up in a simulated game of Certamen as many times as you want.</p>
                        <button className="btn btn-soft w-full">Practice {">"}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}