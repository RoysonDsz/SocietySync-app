import "dotenv/config";
import jwt from "jsonwebtoken";
import notificationModel from "../models/notification.model.js";
import signupModel from "../models/signup.model.js";

const createNotification = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const JWT = process.env.JWT_SECRET;

  if (!token) {
    return res.status(404).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const { title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { id } = jwt.verify(token, JWT);
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = await signupModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const notification = new notificationModel({
      name: user.name,
      role: user.role,
      title,
      message,
    });
    await notification.save();
    res
      .status(201)
      .json({ message: "Notification created successfully", notification });
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel.find();

    // const count = await notificationModel.countDocuments();
    res.status(201).json({
      success: true,
      message: "All Notifications",
      notifications,
      //   totalPages: Math.ceil(count / limit),
      //   currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

// Get notifications by role
const getNotificationsByRole = async (req, res) => {
  try {
    const { role } = req.params;

    // Validate role
    const validRoles = ["resident", "admin", "president", "watchman"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const notifications = await notificationModel
      .find({ role })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

// Get a single notification by ID
const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await notificationModel.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notification", error });
  }
};

// Delete a notification by ID
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await notificationModel.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification", error });
  }
};

// Export all controller functions
export {
    createNotification,
    deleteNotification,
    getAllNotifications,
    getNotificationById,
    getNotificationsByRole
};

