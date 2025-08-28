import { neon } from '@netlify/neon';
import postgres from 'postgres';
import dotenv from 'dotenv'

dotenv.config();

export const sql = neon();