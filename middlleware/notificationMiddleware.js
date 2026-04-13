import Notification from "../models/notification.model.js";

export const isNotificationOwner = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.notification = notification;

    next();
  } catch {
    return res.status(400).json({ message: "Invalid notification id" });
  }
};