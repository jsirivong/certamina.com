import { Link, useNavigate } from "react-router";
import { useLocation } from "react-router";
import axios from "../services/axios";
import { useState } from "react";

interface IProps {
    children: React.ReactNode;
}

export default function Navbar({ children }: IProps) {
    const [error, setError] = useState<null | string>(null);
    const location = useLocation();
    const pathname = location.pathname;
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            navigate("/login")

            await axios.post("/auth/logout");
        } catch (err: any) {
            setError(err.response.data?.message);
        }
    }

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
                                {true && (
                                    <div className="flex flex-row gap-2 items-center">
                                        <div className="avatar">
                                            <div className="w-8 rounded-full">
                                                <img
                                                    alt="User Avatar"
                                                    src="/avatar-placeholder.jpg" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            {children}
        </>
    )
}