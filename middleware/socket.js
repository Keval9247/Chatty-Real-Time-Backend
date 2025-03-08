const { Server } = require("socket.io");

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                const allowedOrigins = [
                    "http://localhost:5173",
                    process.env.APP_LOCAL_URL || "http://localhost:5173",
                    // Add your production frontend URL here
                ];
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    console.log(`Socket.io CORS blocked origin: ${origin}`);
                    callback(new Error("Not allowed by CORS"));
                }
            },
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization", "Accept"],
            credentials: true,
        },
    });

    const usersocketMap = {};
    const getReceiverSocketId = (userId) => usersocketMap[userId];

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
            }
            io.emit("getOnlineUsers", Object.keys(usersocketMap));
        });
    });

    return { io, getReceiverSocketId }; // Return io and utility function
};

module.exports = { initializeSocket };