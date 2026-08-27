import { useState, useEffect } from "react";
import { io, type Socket } from "socket.io-client";
import socket from "../services/socket";

export default function useSocket() {
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        socket?.connect();

        if (socket.connected){
            setConnected(true);
        }
        
        socket?.on("connect", () => {
            setConnected(true);
        })

        socket?.on("disconnect", () => {
            setConnected(false);
        })

        return () => {
            socket?.off("connect");
            socket?.off("disconnect");
        }
    }, []);

    return { socket, connected }
}