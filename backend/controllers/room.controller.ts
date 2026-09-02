import type { Request, Response } from 'express'
import redis from '../services/redis.ts';
import type { Socket, Server } from 'socket.io';

export interface Team {
    id: number;
    name?: string;
    numberOfPlayers?: number;
    players: Player[];
}

export interface Player {
    id: string;
    username: string;
    score: number;
    profile_picture?: string;
    joined_at?: number;
    socket_id?: string;
}

export interface RoomData {
    code: string;
    hostId: string;
    teams: Team[];
    status: "waiting" | "in_progress" | "ended";
    currentQuestion: number;
    created_at?: number;
}

const generateCode = (): string => {
    let code = "";

    for (let i = 0; i < 6; i++) {
        const randNum = Math.floor(Math.random() * 9);

        code += randNum;
    }

    return code
}

export const checkIfRoomExists = async (req: Request, res: Response) => {
    const { code } = req.params;

    try {
        if (!code) {
            return res.status(400).json({ success: false, message: "Please enter a valid code." });
        }

        const roomJSON = await redis.get(`room:${code}`);

        if (!roomJSON) {
            return res.status(404).json({ success: false, message: "Room not found." });
        }

        const room: RoomData = JSON.parse(roomJSON);

        res.status(200).json({ success: true, room: room })
    } catch (err: any) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
}

export const createRoom = async (socket: Socket, user: { email: string, username: string }, callback: Function) => {
    try {
        socket.data.username = user.username;
        const generatedCode = generateCode();

        const host: Player = {
            id: socket.id,
            socket_id: socket.id,
            username: user.username,
            score: 0,
            joined_at: Date.now()
        }

        socket.data.roomcode = generatedCode;

        const roomData: RoomData = {
            code: generatedCode,
            hostId: socket.id,
            teams: [
                { id: 1, name: "Team 1", players: [host] },
                { id: 2, name: "Team 2", players: [] },
                { id: 3, name: "Team 3", players: [] },
            ],
            status: "waiting",
            created_at: Date.now(),
            currentQuestion: 0
        }

        await redis.setex(`room:${generatedCode}`, 3600, JSON.stringify(roomData));

        socket.join(`room:${generatedCode}`);

        callback({ success: true, code: generatedCode, teams: roomData.teams });
    } catch (e: any) {
        console.log("Error in creating room.");
    }
}

export const joinRoom = async (socket: Socket, io: Server, data: { code: string, username: string }, callback: Function) => {
    try {
        socket.join(`room:${data.code}`);
        socket.data.roomcode = data.code;
        socket.data.username = data.username;

        const roomJSON = await redis.get(`room:${data.code}`);

        if (!roomJSON) {
            return callback({ success: false, error: "Room not found." });
        }

        const roomData: RoomData = JSON.parse(roomJSON);

        if (roomData.status !== "waiting") {
            return callback({ success: false, error: "Game has already started." });
        }

        roomData.teams.forEach((team: Team) => {
            team.players.forEach((player: Player) => {
                if (player.username === data.username) {
                    return callback({ success: false, error: "Username is already taken." });
                }
            })
        })

        const player: Player = {
            id: socket.id,
            username: data.username,
            socket_id: socket.id,
            score: 0,
            joined_at: Date.now()
        }

        const smallestTeam = roomData.teams.reduce((prev, curr) =>
            prev.players.length <= curr.players.length ? prev : curr
        );

        smallestTeam.players.push(player);

        io.to(`room:${data.code}`).emit("join-room", { room: roomData });

        await redis.setex(`room:${data.code}`, 3600, JSON.stringify(roomData));

        if (typeof callback === "function"){
            callback({ success: true, room: roomData, player });
        }
    } catch (err: any) {
        console.log("Error in joining room.");
    }
}

export const deleteRoom = async (socket: Socket, data: { code: string }) => {
    try {
        socket.to(`room:${data.code}`).emit("delete-room");

        socket.in(`room:${data.code}`).socketsLeave(`room:${data.code}`);

        await redis.del(`room:${data.code}`);
    } catch (err: any) {
        console.log("Error deleting room: ", err);
    }
}

export const leaveRoom = async (socket: Socket, io: Server, roomCode: string) => {
    try {
        console.log("room code: " + roomCode);
        if (!roomCode) {
            return console.error("Room code was not passed in.");
        }

        const roomJSON = await redis.get(`room:${roomCode}`);

        if (!roomJSON) {
            return console.error("Room does not exist.");
        }

        const roomData: RoomData = JSON.parse(roomJSON);

        if (roomData) {
            roomData.teams.forEach((team: Team) => {
                const updatedPlayers = team.players.filter((player: Player) => player.username !== socket.data.username);
                team.players = updatedPlayers;
            })

            await redis.set(`room:${roomCode}`, JSON.stringify(roomData));
        }

        io.to(`room:${roomCode}`).emit("leave-room", roomData);
        socket.leave(`room:${roomCode}`);
    } catch (err: any) {
        console.log("Error leaving room: ", err);
    }
}