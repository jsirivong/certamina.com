import { io } from 'socket.io-client';

const URL = import.meta.env.PROD ? process.env.VITE_PROD_SOCKET_URL : process.env.VITE_DEV_SOCKET_URL;

export const socket = io(URL)