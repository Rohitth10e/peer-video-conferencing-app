import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export const initializeSocket = (server) => {
  const io = new Server(server);
  // return io
  io.on("connection", (socket) => {
    console.log("Something connected");
    socket.on("join-call", (path) => {
      // if a room dosen't exist create it
      if (connections[path] === undefined) {
        connections[path] = [];
      }
      // add this person to the room's member-list
      connections[path].push(socket.id);
      // remember when(time) they joined
      timeOnline[socket.id] = new Date();
      // notify everyone in the room about new user
      connections[path].forEach((socketId) => {
        io.to(socketId).emit("user-joined", socket.id, connections[path]); // send message to socket
      });

      // catch up system (when you join a room, the server replays all old chat messages)
      if (messages[path] !== undefined) {
        for (let a = 0; a < messages[path].length; ++a) {
          io.to(socket.id).emit(
            "chat-message",
            messages[path][a]["data"],
            messages[path][a]["sender"],
            messages[path][a]["socket-id-sender"]
          );
        }
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {
        let matchingRoom = ''
        let found = false

        for ( const [roomKey, roomValue] of Object.entries(connections)) {
            if(roomValue.includes(socket.id)) {
                matchingRoom = roomKey;
                found = true;
                break 
            }
        }

        if (found) {
            if (messages[matchingRoom] === undefined ) {
                messages[matchingRoom] = []
            }
            messages[matchingRoom].push({'sender':sender, 'data': data, 'socket-id-sender': socket.id })
            console.log("message", matchingRoom, ":", sender, data);

            connections[matchingRoom].forEach(socketId => {
                io.to(socketId).emit("chat-message", data, sender, socket.id)
            })
        }
    });
  });
};
