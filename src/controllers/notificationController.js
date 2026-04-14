import * as notificationService from "../services/notificationService.js";
import { successResponse, errorResponse } from "../utils/helpers.js";

export async function getNotifications(req, res, next) {
    try {
        const notifications = await notificationService.getNotifications(req.user._id);
        return successResponse(res, 200, "Notifications fetched", { notifications });
    } catch (error) {
        next(error);
    }
}

export async function markAsRead(req, res, next) {
    try {
        const notification = await notificationService.markAsRead(req.params.id);

        if (!notification) {
            return errorResponse(res, 404, "Notification not found");
        }

        return successResponse(res, 200, "Notification marked as read", { notification });
    } catch (error) {
        next(error);
    }
}

export async function markAllAsRead(req, res, next) {
    try {
        await notificationService.markAllAsRead(req.user._id);
        return successResponse(res, 200, "All notifications marked as read");
    } catch (error) {
        next(error);
    }
}