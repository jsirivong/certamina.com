import { Server, type Socket } from "socket.io";

export const handleGameSocket = (socket: Socket, io: Server) => {
    socket.on("join-room", (code: string, username: string): void =>{
        socket.join(code);

        io.to(code).emit("player-join", username)
    })
}