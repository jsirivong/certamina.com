import { useState, useEffect } from "react";
import { io, type Socket} from "socket.io-client";

export default function useSocket(){
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(()=>{
        const newSocket = io(import.meta.env.VITE_DEV_SOCKET_URL);
        
        newSocket.on("connect", () => {
            console.log("Socket is connected.");
            setConnected(true);
        })

        newSocket.on("disconnect", () => {
            console.log("Socket disconnected.");
            setConnected(false);
        })

        setSocket(newSocket);

        return () => {
            newSocket.close();
        }
    }, [])

    return { socket, connected }
}