import express from 'express'
import {createServer} from 'node:http'
import {Server} from 'socket.io'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config({ debug: true });
import { initializeSocket } from './controllers/socketmanager.js';
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import bodyParser from 'body-parser';

const app = express();
app.use((req, res, next) => {
    console.log(`[Request Entry] Path: ${req.path}`);
    console.log('[Request Entry] Authorization Header:', req.headers.authorization);
    next(); // Pass control to the next middleware
});
const server = createServer(app);
const io = initializeSocket(server)
const PORT = process.env.PORT || 8000

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type']
}));
app.use(bodyParser.json({limit:'40kb'}))
app.use(express.urlencoded({extended:true, limit:'40kb'}))


app.set("port", PORT)

const db = async() =>{
    await mongoose.connect("mongodb+srv://rohith10e:2223@peer-video-conference-a.ycceffc.mongodb.net/" || process.env.MONGO_URI)
    .then(()=> console.log("Connected to db"))
    .catch((err)=> console.error("connection to db failed: ", err.message))
}

app.use("/api/v1/users",userRoutes)

server.listen(PORT, async () => {
    await db()
    console.log(`server running on port: ${PORT}`);
})