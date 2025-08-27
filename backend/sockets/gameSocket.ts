import { Server, type Socket } from "socket.io";

export const handleGameSocket = (socket: Socket, io: Server) => {
    socket.on("joinRoom", (player: {id?: number | string, username: string}, roomCode: string) => {
        socket.join(roomCode);
        io.emit("joinRoom", player)
    })

    io.emit("playerJoin", () => {

    })
}