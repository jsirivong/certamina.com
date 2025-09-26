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

            if (response.data.user){
                if (response.data.user.username && response.data.user.email){
                    setUser(response.data.user);
                }
            }
        } catch (err: any) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    return { loading, user, setUser, checkAuthentication }
}