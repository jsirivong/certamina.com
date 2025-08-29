import { Link } from "react-router";
import { useLocation } from "react-router";
import { useThemeStore } from "../store/useThemeStore";

interface IProps {
    isAuthenticated?: boolean;
    children: React.ReactNode;
    username?: string | undefined;
    handleLogout: () => void;
    loading: boolean;
}

export default function Navbar({ isAuthenticated, children, username, handleLogout, loading }: IProps) {
    const location = useLocation();
    const pathname = location.pathname;

    const { theme, setTheme } = useThemeStore();

    return (
        <>
            <div className="navbar top-0 z-30 fixed flex bg-base-100 shadow-sm">
                <div className="p-3 flex-none">
                    <Link to={"/"} className="flex flex-row items-center gap-x-4">
                        <img className="size-11" src="/certaminaicon.png" alt="Certamina Home Icon" />
                        <h1 className="text-2xl font-semibold">Certamina</h1>
                    </Link>
                </div>
                <div className="container">
                    <div className="flex justify-end gap-10 px-10">
                        {!pathname.startsWith("/practice") && (
                            <>
                                <div className="gap-3">
                                    <a className="btn btn-ghost" href="/contact">Contact</a>
                                    <a className="btn btn-ghost" href="/about">About</a>
                                    {!pathname.startsWith("/join") && !pathname.startsWith("/room") && (
                                        <div className="dropdown">
                                            <button tabIndex={0} role="button" className="btn btn-ghost">Play</button>

                                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                                <li><a href="/practice">Practice</a></li>
                                                <li><a href="/join">Join</a></li>
                                                <li><a href="/host">Host</a></li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                {isAuthenticated ? (
                                    <div className="flex flex-row gap-2 gap-x-4 items-center">
                                        <div className="dropdown dropdown-end">
                                            <div className="avatar hover:cursor-pointer" tabIndex={0} role="button">
                                                <div className="ring-black rounded-full ring-2">
                                                    <div className="w-8 rounded-full">
                                                        <img
                                                            alt="User Avatar"
                                                            src="/avatar-placeholder.jpg" />
                                                    </div>
                                                </div>
                                            </div>

                                            <ul className="dropdown-content relative top-10 bg-base-100 rounded w-52 z-1 shadow-l" tabIndex={0}>
                                                <li role="button" className="btn btn-ghost w-full justify-start p-0">
                                                    <label className="flex cursor-pointer gap-2 items-center w-full h-full pl-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round">
                                                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                                        </svg>
                                                        <input type="checkbox" value={theme} className="toggle theme-controller" checked={theme === "dark" ? true : false} onChange={(e) => {
                                                            if (e.target.value === "light"){
                                                                setTheme("dark")
                                                            } else {
                                                                setTheme("light")
                                                            }
                                                        }}/>
                                                    </label>
                                                </li>
                                                <li role="button" className="btn btn-ghost w-full justify-start" onClick={handleLogout}><img src="/logout.png" className="size-5" />Log out</li>
                                            </ul>
                                        </div>
                                        <h3 className="font-semibold text-sm border-b-2">{username}</h3>
                                    </div>
                                ) : (
                                    loading ? <span className="loading loading-spinner loading-lg"></span> : <Link className="border-2 px-5 rounded-3xl bg-base-100 btn" to={"/register"}>Sign Up</Link>
                                )
                                }
                            </>
                        )}
                    </div>
                </div>
            </div>
            {children}
        </>
    )
}