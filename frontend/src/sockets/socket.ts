import { io } from 'socket.io-client';

const URL = import.meta.env.PROD ? import.meta.env.VITE_PROD_SOCKET_URL : import.meta.env.VITE_DEV_SOCKET_URL;

export const socket = io(URL)