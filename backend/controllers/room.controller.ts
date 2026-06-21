import type { Request, Response } from 'express'
import redis from '../services/redis.ts';
import type { Socket, Server } from 'socket.io';

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
    players: Player[];
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

    if (!code) {
        return res.json({ success: false, message: "Please enter a valid code." });
    }

    const gameExists = (await redis.get(`room:${code}`)) !== null;

    res.json({ success: true, exists: gameExists })
}

export const createRoom = async (socket: Socket, callback: Function) => {
    try {
        const generatedCode = generateCode();

        const host: Player = {
            id: socket.id,
            socket_id: socket.id,
            username: "dasjfad",
            score: 0,
            joined_at: Date.now()
        }

        const roomData: RoomData = {
            code: generatedCode,
            hostId: socket.id,
            players: [host],
            status: "waiting",
            created_at: Date.now(),
            currentQuestion: 0
        }

        await redis.setex(`room:${generatedCode}`, 3600, JSON.stringify(roomData));

        socket.join(`room:${generatedCode}`);

        callback({ success: true, code: generatedCode, username: host.username});
    } catch (e: any) {
        console.log("Error in creating room.");
    }
}

export const joinRoom = async (socket: Socket, data: {code: string, username: string}, callback: Function) => {
    try {
        socket.join(`room${data.code}`);

        const roomJSON = await redis.get(`room:${data.code}`);

        if (!roomJSON) {
            return callback({success: false, error: "Room not found."});
        }

        const roomData: RoomData = JSON.parse(roomJSON);

        if (roomData.status !== "waiting"){
            return callback({success: false, error: "Game has already started."});
        }

        const usernameTaken = roomData.players.some((p) => p.username === data.username);
        if (usernameTaken){
            return callback({success: false, error: "Username is already taken."});
        }

        const player: Player = {
            id: socket.id,
            username: data.username,
            socket_id: socket.id,
            score: 0,
            joined_at: Date.now()
        }

        roomData.players.push(player);

        socket.emit("join-room", {room: roomData, code: data.code})

        await redis.setex(`room:${data.code}`, 3600, JSON.stringify(roomData));

        callback({success: true, room: roomData, player})
    } catch (err: any) {
        console.log("Error in joining room.");
    }
}

export const deleteRoom = async (socket: Socket, data: {code: string}) => {
    try {
        socket.to(`room:${data.code}`).emit("delete-room");

        socket.in(`room:${data.code}`).socketsLeave(`room:${data.code}`);

        await redis.del(`room:${data.code}`);
    } catch (err: any){
        console.log("Error deleting room: ", err);
    }
}