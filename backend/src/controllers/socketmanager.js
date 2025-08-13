import { Server } from "socket.io"

export const initializeSocket =(server)=>{
    const io = new Server(server)
    return io
}