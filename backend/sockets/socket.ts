import { Server, type Socket } from 'socket.io'
import { handleGameSocket } from './gameSocket.ts';

export const initializeSocketIOServer = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("New Websocket connected.");

        handleGameSocket(socket, io);

        socket.on("disconnect", () => {
            console.log(`Websocket '${socket.id}' disconnected.`);
        })
    })
}