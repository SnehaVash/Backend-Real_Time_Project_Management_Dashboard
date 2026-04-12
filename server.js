import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { initSocket } from "./src/sockets/socket.js";
import logger from "./src/utils/logger.js";
import { PORT } from "./src/config/env.js";

const server = http.createServer(app);

initSocket(server);

connectDB().then(() => {
    server.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    logger.error(`Database connection failed! ${error.message}`);
    process.exit(1);
});

export default server;