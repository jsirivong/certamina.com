import { useThemeStore } from "../store/useThemeStore"
import { useUserStore } from "../store/useUserStore";

export default function Settings() {
    const { theme } = useThemeStore();
    const { user } = useUserStore();

    return (
        <div className="h-screen flex flex-row" data-theme={theme}>
            <div className="h-screen w-3xs bg-base-300 flex flex-col gap-y-6">
                <div className="my-6 max-h-screen space-y-2">
                    <div className="rounded-full h-16 w-16 mx-auto">
                        <img src="/avatar-placeholder.jpg" className="rounded-full w-full h-full" />
                    </div>
                    <div>
                        <h2 className="text-center text-xl tracking-tight">Jonathan Sirivong</h2>
                        <p className="text-center tracking-tight">@{user?.username}</p>
                    </div>
                </div>
                <div className="px-8 flex flex-col justify-center">
                    <button className="btn btn-ghost w-full font-normal text-lg">Profile</button>
                    <button className="btn btn-ghost w-full font-normal text-lg">Stats</button>
                </div>
            </div>
            <div className="h-screen w-screen bg-base-100">
                <div className="my-6 max-h-screen space-y-2">
                    <div className="rounded-full h-30 w-30 mx-auto ring-2">
                        <img src="/avatar-placeholder.jpg" className="rounded-full w-full h-full" />
                    </div>
                    <div>
                        <h2 className="text-center text-3xl tracking-tight">Jonathan Sirivong</h2>
                        <p className="text-center tracking-tight">@{user?.username}</p>
                    </div>
                </div>
                <div className="p-10 max-w-3xl space-y-5">
                    <div className="flex flex-col space-y-2">
                        <label className="label">First Name</label>
                        <input value={"first name lol"} disabled className="w-full input" />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="label">Last Name</label>
                        <input value={"last name lol"} disabled className="w-full input" />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="label">Username</label>
                        <input value={user?.username} disabled className="w-full input" />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="label">Email</label>
                        <input value={user?.email} disabled className="w-full input" />
                    </div>
                </div>
            </div>
        </div>
    )
}