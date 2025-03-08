const { Server } = require('socket.io');
const http = require('http');
const express = require('express');
const { userInfo } = require('os');

const app = express();
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

const usersocketMap = {} // {userId: socketId} to store online users

const getReceiverSocketId = (userId) => {
    return usersocketMap[userId];
}
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        usersocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(usersocketMap));

    socket.on("newMessage", (message) => {
        console.log("New message received by socket:", message);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        if (userId) {
            delete usersocketMap[userId];
            console.log(`Removed userId ${userId} from the map`);
        }

        io.emit("getOnlineUsers", Object.keys(usersocketMap));
    });
});

module.exports = { io, server, app, getReceiverSocketId };

