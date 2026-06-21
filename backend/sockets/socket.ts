import { Server, type Socket } from 'socket.io'
import { createRoom, joinRoom, deleteRoom } from '../controllers/room.controller.ts';
import redis from '../services/redis.ts';

import type { RoomData, Player } from '../controllers/room.controller.ts';

export const initializeSocketIOServer = (io: Server) => {
    // when a new socket connects
    io.on("connection", (socket: Socket) => {
        console.log("New Websocket connected.");

        socket.on("create-room", (callback) => {
            createRoom(socket, callback);
        })

        socket.on("join-room", (data, callback) => {
            joinRoom(socket, data, callback)
        })

        socket.on("delete-room", (data) => {
            deleteRoom(socket, data);
        })

        socket.on("chat-message", async (data) => {
            const roomJSON = await redis.get(`room:${data.roomCode}`)

            if (!roomJSON) {
                console.log("Room doesn't exist.");
                return;
            };

            const roomData: RoomData = JSON.parse(roomJSON);

            const player = roomData.players.find((player: Player) => player.socket_id === socket.id)

            if (!player) return console.error("Couldn't find player messenger.");

            const message = {
                id: socket.id,
                text: data.chatMessage,
                username: player.username,
                created_at: Date.now(),
                user_id: socket.id
            }

            io.to(`room:${data.roomCode}`).emit("chat-message", message);
        })

        socket.on("disconnect", async () => {
            console.log(`Websocket '${socket.id}' disconnected.`);

            try {
                const keys = await redis.keys(`room:*`);

                for (const key of keys) {
                    const code = key.split(":")[1];
                    const roomJSON = await redis.get(`room:${code}`);

                    if (!roomJSON) return;

                    const roomData = JSON.parse(roomJSON);

                    if (!roomData) return;

                    if (roomData.hostId === socket.id) {
                        await deleteRoom(socket, { code });
                        break;
                    }
                }
            } catch (e: any) {
                console.log("Error in host deleting room: ", e);
            }
        })
    })
}