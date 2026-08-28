import { Server, type Socket } from 'socket.io'
import { createRoom, joinRoom, deleteRoom, leaveRoom } from '../controllers/room.controller.ts';
import redis from '../services/redis.ts';

import type { RoomData, Player, Team } from '../controllers/room.controller.ts';

export const initializeSocketIOServer = (io: Server) => {
    let timeoutLookups = new Map<string, NodeJS.Timeout>();
    // when a new socket connects
    io.on("connection", (socket: Socket) => {
        console.log("new websocket connected");
        socket.on("create-room", (user, callback) => {
            createRoom(socket, user, callback);
        })

        socket.on("join-room", (data, callback) => {
            joinRoom(socket, io, data, callback)
        })

        socket.on("delete-room", (data) => {
            deleteRoom(socket, data);
        })

        socket.on("leave-room", (roomCode: string) => {
            leaveRoom(socket, io, roomCode)
        })

        socket.on("rejoin-room", async (username: string, roomCode: string) => {
            console.log("Username: " + username);
            if (timeoutLookups.has(username)) {
                clearTimeout(timeoutLookups.get(username)!);
                timeoutLookups.delete(username);
            }

            console.log("Here is the lookups: " + timeoutLookups);
            socket.join(`room:${roomCode}`);
            socket.data.roomcode = roomCode;
            socket.data.username = username;
        })

        socket.on("chat-message", async (data) => {
            const roomJSON = await redis.get(`room:${data.roomCode}`)

            if (!roomJSON) {
                console.log("Room doesn't exist.");
                return;
            };

            const roomData: RoomData = JSON.parse(roomJSON);

            let messenger: Player | undefined;

            roomData.teams.forEach((team: Team) => {
                team.players.forEach((player: Player) => {
                    if (socket.data.username === player.username) {
                        messenger = player;
                    }
                })
            })

            if (!messenger) return console.error("Couldn't find player messenger.");

            const message = {
                id: socket.id + Date.now(),
                text: data.chatMessage,
                username: messenger.username,
                created_at: Date.now(),
                user_id: socket.id
            }

            io.to(`room:${data.roomCode}`).emit("chat-message", message);
        })

        socket.on("disconnect", async () => {
            if (!socket.data.username) return;

            const timeout = setTimeout(() => {
                leaveRoom(socket, io, socket.data.roomcode);
                timeoutLookups.delete(socket.data.username);
            }, 10000)

            timeoutLookups.set(socket.data.username, timeout);

            // try {
            //     const keys = await redis.keys(`room:*`);

            //     for (const key of keys) {
            //         const code = key.split(":")[1];
            //         const roomJSON = await redis.get(`room:${code}`);

            //         if (!roomJSON) return;

            //         const roomData = JSON.parse(roomJSON);

            //         if (!roomData) return;

            //         if (roomData.hostId === socket.id) {
            //             await deleteRoom(socket, { code });
            //             break;
            //         }
            //     }
            // } catch (e: any) {
            //     console.log("Error in host deleting room: ", e);
            // }
        })
    })
}