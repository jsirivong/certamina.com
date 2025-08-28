import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import morgan from 'morgan'
import auth from './routes/auth.route.ts';
// import room from './routes/room.route.ts'
// import email from './routes/email.route.ts'
import practice from './routes/practice.route.ts';
import { sql } from "./lib/database.ts"
import cookieparser from 'cookie-parser'
import { createServer } from 'http';
import { initializeSocketIOServer } from './sockets/socket.ts';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const PORT = process.env.NODE_ENV === "production" ? process.env.PROD_PORT : process.env.PORT;

const server = createServer(app);

app.use(cors({
    origin: ["https://certamina.com", "http://localhost:5173"],
    credentials: true
}));
app.use(cookieparser());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/v1/auth", auth)
// app.use("/api/v1/room", room)
// app.use("/api/v1/email", email)
app.use("/api/v1/practice", practice)

const initializeUsersDatabase = async () => {
    try {
        await sql`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP    
        )`

        console.log("Initialized User Database.")
    } catch (err) {
        console.log("Trouble starting user database.")
        console.error(err);
    }
}

const io = new Server(server, { 
    cors: {
        origin: ["https://certamina.com", "http://localhost:5173"]
    }
})

initializeUsersDatabase().then(() => {
    initializeSocketIOServer(io);

    server.listen(PORT, () => {
        console.log(`Server running on localhost:${PORT}\nServer listening to port ${PORT}`);
    }).on("error", (err) => {
        console.log("Error starting server.", err);
    })
})