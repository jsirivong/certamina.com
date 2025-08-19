import { useState, type FormEvent } from "react";
import axios from "../services/axios.ts";
import { useNavigate } from "react-router";

interface RegisterData {
    username: string;
    password: string;
    email: string;
}

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);
    const [registerData, setRegisterData] = useState<RegisterData>({
        username: "",
        password: "",
        email: ""
    })

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post("/auth/register", registerData)

            if (response.data.message === "success") {
                navigate("/");
                setError(null);
            }
        } catch (err: any) {
            setError(err.response.data?.message);
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-screen flex justify-center" data-theme="light">
            <div className="max-w-screen bg-base-100 w-full p-10 lg:flex lg:flex-row">
                <div className="max-w-[50vw] w-full">
                    <div className="p-6">
                        <h1 className="font-semibold text-4xl text-center">Register</h1>
                    </div>

                    {error && (
                        <div className="error">
                            {error}
                        </div>
                    )}

                    <form className="space-y-10" onSubmit={handleSubmit}>
                        <div className="max-w-sm space-y-4">
                            <div className="flex flex-col">
                                <label className="label">
                                    <span className="label-text mb-2 font-semibold">Username</span>
                                </label>
                                <input className="input input-bordered w-full" type="text" placeholder="Username" value={registerData.username} onChange={e => setRegisterData({ ...registerData, username: e.target.value })} required />
                                <p className="text-base-content/60 text-sm">
                                    Username must be at least 6 characters*
                                </p>
                            </div>
                            <div className="flex flex-col">
                                <label className="label">
                                    <span className="label-text mb-2 font-semibold">Password</span>
                                </label>
                                <input className="input input-bordered w-full" type="password" placeholder="Password" value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} required />
                                <p className="text-base-content/60 text-sm">
                                    Password must be at least 8 characters*
                                </p>
                            </div>
                            <div className="flex flex-col">
                                <label className="label">
                                    <span className="label-text mb-2 font-semibold">Email</span>
                                </label>
                                <input className="input input-bordered w-full" type="email" placeholder="Email" value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} required />
                            </div>
                        </div>

                        <div className="divider">OR</div>

                        {/* Google Auth */}
                        <div>
                            <button className="btn w-full">
                                <>
                                    <img src="google.png" alt="Google Sign-In" className="bg-base-100 size-5" />
                                    Continue with Google
                                </>
                            </button>
                        </div>

                        <div>
                            <button className="btn w-full" type="submit" disabled={registerData.password.length < 8 || registerData.username.length < 6}>
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-md"></span>
                                        Loading
                                    </>
                                ) : `Create Account >`}
                            </button>
                            <p className="text-center text-base-content/70 mt-4">
                                Already have an account?{" "}
                                <a className="link" href="/login">Login</a>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="hidden lg:block max-w-[50vw] max-h-[70vh] w-full bg-base-100 p-10 text-center">
                    <img src="/register.svg" alt="Register Quiz Image" className="w-full h-full" />
                    <h2 className="text-3xl font-extrabold">Register your account.</h2>
                    <p className="text-base-content/70">Compete with others in the world of classics.</p>
                </div>
            </div>
        </div>
    )
}