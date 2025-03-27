import express from 'express';
import {
    createNotification,
    deleteNotification,
    getAllNotifications,
    getNotificationById,
    getNotificationsByRole,
} from '../controllers/notification.controllers.js';

const NotificationRouter = express.Router();

NotificationRouter.post('/create', createNotification);
NotificationRouter.get('/get', getAllNotifications);
NotificationRouter.get('/role/:role', getNotificationsByRole);
NotificationRouter.get('/notification-by/:id', getNotificationById);
NotificationRouter.delete('/delete-notification/:id', deleteNotification);

export default NotificationRouter;