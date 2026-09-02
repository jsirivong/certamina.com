import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_DEV_SOCKET_URL, { autoConnect: true });

export default socket;