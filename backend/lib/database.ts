import { neon } from '@netlify/neon';
import postgres from 'postgres';
import dotenv from 'dotenv'

dotenv.config();

export let sql;

if (process.env.NODE_ENV === "development"){
    sql = postgres({
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT) || 5432,
    database: process.env.PG_DATABASE,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD});
} else if (process.env.NODE_ENV==="production"){
    sql = neon();
}