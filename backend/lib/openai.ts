import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

let client: OpenAI | null = null;

try {
    if (process.env.OPEN_AI_API_KEY) {
        client = new OpenAI({
            apiKey: process.env.OPEN_AI_API_KEY
        })
    }
} catch (err) {
    console.error("Error in creating OpenAI client.", err);
    process.exit(1);
}

export default client;

