import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import morgan from 'morgan'
import auth from './routes/auth.route.ts';
import sql from './config/database.ts';
import cookieparser from 'cookie-parser'

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieparser());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/v1/auth", auth)

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

initializeUsersDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on localhost:${PORT}\nServer listening to port ${PORT}`);
    }).on("error", (err) => {
        console.log("Error starting server.", err);
    })
})