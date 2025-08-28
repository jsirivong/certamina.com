import { neon } from '@netlify/neon';
import postgres from 'postgres';
import dotenv from 'dotenv'

dotenv.config();

export const sql: any = process.env.NODE_ENV === "development" ? postgres({
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT) || 5432,
    database: process.env.PG_DATABASE,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD
}) : neon();