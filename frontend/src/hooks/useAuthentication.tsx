import { useState } from "react";
import axios from "../services/axios.ts";
import { useUserStore } from "../store/useUserStore.ts";

export default function useAuthentication() {
    const [loading, setLoading] = useState<boolean>(false);
    const { user, setUser } = useUserStore();

    const checkAuthentication = async () => {
        try {
            setLoading(true)
            const response = await axios.get("/auth")

            console.log(response.data)

            if (response.data.success) {
                setUser(response.data.user)
            } else {
                setUser(null);
            }
        } catch (err: any) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    return { loading, user, setUser, checkAuthentication }
}