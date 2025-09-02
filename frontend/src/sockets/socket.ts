import { io } from 'socket.io-client';

// add socket url to .env file (ws://localhost:3000)
const URL = import.meta.env.PROD ? process.env.VITE_PROD_SOCKET_URL : process.env.VITE_DEV_SOCKET_URL;

export const socket = io(URL)