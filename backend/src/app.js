import express from 'express'
import {createServer} from 'node:http'
import {Server} from 'socket.io'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config({ debug: true });
import { initializeSocket } from './controllers/socketmanager.js';
import cors from 'cors'

const app = express();
const server = createServer(app);
const io = initializeSocket(server)
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json({limit:'40kb'}))
app.use(express.urlencoded({extended:true, limit:'40kb'}))

 
app.set(PORT)

const db = async() =>{
    await mongoose.connect("mongodb+srv://rohith10e:2223@peer-video-conference-a.ycceffc.mongodb.net/" || process.env.MONGO_URI)
    .then(()=> console.log("Connected to db"))
    .catch((err)=> console.error("connection to db failed: ", err.message))
}

server.listen(PORT, async () => {
    await db()
    console.log("server running on port: 8000")
})