import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const sql = postgres({
    host: process.env.HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DATABASE,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
})

export default sql