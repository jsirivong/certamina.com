import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import morgan from 'morgan'

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: "localhost:5173",
}));
app.use(morgan("dev"));

app.listen(PORT, ()=>{
    console.log(`Server running on localhost:${PORT}`);
}).on("error", (err)=>{
    console.log("Error starting server.", err);
})