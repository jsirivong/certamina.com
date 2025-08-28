import { io } from 'socket.io-client';

const URL = import.meta.env.PROD ? "https://certamina.com" : "ws://localhost:3000";

export const socket = io(URL)