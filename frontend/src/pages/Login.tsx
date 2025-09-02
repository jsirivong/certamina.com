import { useState, type FormEvent } from "react"
import axios from "../services/axios.ts";
import { useNavigate } from "react-router";
import useAuthentication from "../hooks/useAuthentication.tsx";

interface LoginData {
    email: string;
    password: string;
}

export default function Login() {
    const { checkAuthentication } = useAuthentication();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);
    const [loginData, setLoginData] = useState<LoginData>({
        email: "",
        password: ""
    })

    const handleSubmitLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true);

        try {
            const response = await axios.post("/auth/login", loginData);

            if (response.data.success) {
                setError(null);
                navigate("/");
                checkAuthentication();
            }
        } catch (err: any) {
            setError(err.response.data?.message);
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen flex items-center justify-center" data-theme="light">
            <div className="bg-base-100 max-w-xl w-full p-10">
                <div className="flex justify-center">
                    <img src="certaminaicon.png" alt="Certamina Icon Login" className="size-20" />
                </div>
                <div className="p-5">
                    <h2 className="text-center text-4xl font-semibold">Login To Certamina</h2>
                </div>

                {error && (
                    <div className="alert alert-warning my-5">
                        <span className="">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmitLogin}>
                    <div className="space-y-5">
                        <div className="flex flex-col">
                            <label className="label">
                                <span className="label-text mb-2 font-semibold">Email</span>
                            </label>
                            <input className="input input-bordered w-full" type="email" value={loginData.email} placeholder="Email" onChange={e => setLoginData({ ...loginData, email: e.target.value })} />
                        </div>
                        <div className="flex flex-col">
                            <label className="label">
                                <span className="label-text mb-2 font-semibold">Password</span>
                            </label>
                            <input className="input input-bordered w-full" type="password" value={loginData.password} placeholder="Password" onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
                        </div>
                    </div>

                    <div className="divider">OR</div>

                    <div className="mb-10">
                        <button className="btn w-full">
                            <>
                                <img src="/google.png" alt="Google Sign-In" className="size-5" />
                                Continue with Google
                            </>
                        </button>
                    </div>

                    <div>
                        <button className="btn w-full" type="submit" disabled={loginData.password.length < 8}>
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-md"></span>
                                    Loading
                                </>
                            ) : `Login >`}
                        </button>
                        <p className="text-center text-base-content/70 mt-4">
                            Don't have an account?{" "}
                            <a className="link" href="/register">Create One</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}