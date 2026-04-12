import { Server } from "socket.io";
import logger from "../utils/logger.js";

let io;

export function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {

        logger.info(`User connected: ${socket.id}`);

        socket.on("join", (userId) => {
            socket.join(userId);

            logger.info(`User ${userId} joined their room`);
        });

        socket.on("disconnect", () => {
            
            logger.info(`User disconnected: ${socket.id}`);
        });
    });

    return io;
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
}