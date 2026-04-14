import logger from "../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {
  
    logger.error(`${err.message} | Route: ${req.originalUrl} | Method: ${req.method}`);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Server error";

    if (err.name === "CastError") {
        statusCode = 404;
        message = "Resource not found!";
    }

    if (err.code === 11000) {
        statusCode = 409;
        message = "Duplicate field value entered!";
    }

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(", ");
    }

    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token!";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired!";
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};

export default errorMiddleware;