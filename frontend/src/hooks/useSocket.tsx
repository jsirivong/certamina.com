import { useState, useEffect } from "react";
import socket from "../services/socket";

export default function useSocket() {
    const [connected, setConnected] = useState<boolean>(socket.connected);

    useEffect(() => {
        const onConnect = () => setConnected(true);
        const onDisconnect = () => setConnected(false);

        socket?.on("connect", onConnect);
        socket?.on("disconnect", onDisconnect)

        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            socket?.off("connect", onConnect);
            socket?.off("disconnect", onDisconnect);
        }
    }, []);

    return { socket, connected }
}