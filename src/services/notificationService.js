import Notification from "../models/notification.model.js";
import { getIO } from "../sockets/socket.js";

export async function notifyUser({ userId, message, type }) {

    const notification = await Notification.create({
        userId,
        message,
        type
    });

    const io = getIO();
    io.to(userId.toString()).emit("notification", {
        message,
        type,
        createdAt: notification.createdAt
    });

    return notification;
}

export async function getNotifications(userId) {
    const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 });
    return notifications;
}

export async function markAsRead(notificationId) {
    const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
    );
    return notification;
}

export async function markAllAsRead(userId) {
    await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
    );
}