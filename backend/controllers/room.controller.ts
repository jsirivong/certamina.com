import type { Response } from 'express'
import { redis } from '../services/redis.ts';
import { generateRoomCode } from '../utils/generatecode.ts';
import type AuthorizedUserRequest from '../types/AuthorizedUserRequest.ts';

// interface RoomState {
//     hostId: string;
//     currentQuestion: number;
//     created_at: Date;
// }

// interface Team {
//     id: string;
//     name: string;
//     score: string;
// }

// const SECONDS_TILL_EXPIRE = 60 * 60

// export const createRoom = async (req: AuthorizedUserRequest, res: Response) => {
//     try {
//         const { hostId } = req.cookies.token
//         const roomCode = generateRoomCode();

//         await redis.hset(`room:${roomCode}`, {
//             // room metadata
//             hostId,
//             currentQuestion: 0,
//             created_at: Date.now()
//         })

//         for (let i = 1; i <= 3; i++) {
//             await redis.hset(`room:${roomCode}:team:${i}`, {
//                 id: i,
//                 name: `Team ${i}`,
//                 score: 0,
//             });
//             await redis.sadd(`room:${roomCode}:team:${i}:players`)
//             await redis.sadd(`room:${roomCode}:teams`, i);
//         }

//         await Promise.all([
//             // adds an expiration to room key-value pair
//             redis.expire(`room:${roomCode}`, SECONDS_TILL_EXPIRE),
//             redis.expire(`room:${roomCode}:teams`, SECONDS_TILL_EXPIRE)
//         ]);

//         res.status(201).json({ success: true, message: `Room ${roomCode} successfully created.` })
//     } catch (err: any) {
//         console.log("Error in creating room.\n", err)
//         res.status(500).json({ success: false, message: "Server failed creating room." });
//     }
// }

// export const joinRoom = async (req: AuthorizedUserRequest, res: Response) => {
//     try {
//         const { code } = req.params;

//         if (!await redis.exists(`room:${code}`)) return res.status(400).json({ success: false, message: "Room not found." });
//         if (!req.user) return res.status(400).json({ success: false, message: "User not found." });

//         const teamIds = await redis.smembers(`room:${code}:teams`);

//         // assign user to the team with lowest members
//         let lowestPlayerCountTeam: Record<string, string> | null = null;
//         let lowestPlayerCount = Infinity;

//         for (const teamId of teamIds) {
//             const team = await redis.hgetall(`room:${code}:team:${teamId}`);
//             const playerCount = await redis.scard(`room:${code}:team:${teamId}:players`)
//             const players = await redis.smembers(`room:${code}:team:${teamId}:players`)

//             if (playerCount < lowestPlayerCount){
//                 lowestPlayerCount = playerCount;
//                 lowestPlayerCountTeam = team;
//             }
//         }

//         await redis.sadd(`room:${code}:team:${lowestPlayerCountTeam?.id}:players`, req.user?.username)

//         Promise.all([
//             redis.expire(`room:${code}:team:1:players`, SECONDS_TILL_EXPIRE),
//             redis.expire(`room:${code}:team:2:players`, SECONDS_TILL_EXPIRE),
//             redis.expire(`room:${code}:team:3:players`, SECONDS_TILL_EXPIRE),
//         ]);

//         res.status(201).json({ success: true, code: code, message: `Successfully joined room ${code}.` })
//     } catch (err: any) {
//         console.log("Error in joining room.\n", err)
//         res.status(500).json({ success: false, message: "Server failed joining room." });
//     }
// }