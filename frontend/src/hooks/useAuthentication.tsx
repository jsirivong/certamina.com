import { useState } from "react";
import type User from "../types/User";
import axios from "../services/axios.ts";
import { useNavigate } from "react-router";

export default function useAuthentication() {
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<User>()
    const navigate = useNavigate();

    const checkAuthentication = async () => {
        setLoading(true);

        try {
            const response = await axios.get("/auth")

            if (response.data.user) {
                setUser(response.data.user);
            }
        } catch (err: any) {
            console.log(err)
        } finally {
            setLoading(false);
        }
    }

    return { loading, user, checkAuthentication }
}