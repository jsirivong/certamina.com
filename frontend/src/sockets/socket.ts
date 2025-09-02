import { io } from 'socket.io-client';

// add socket url to .env file (ws://localhost:3000)
const URL = import.meta.env.PROD ? "https://certamina.com" : "ws://localhost:3000";

export const socket = io(URL)