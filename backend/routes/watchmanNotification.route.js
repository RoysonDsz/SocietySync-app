import express from 'express';
import { createVisitorAlert, getNotifications, markNotificationAsRead, markAllAsRead } from '../controllers/watchmanNotification.controllers.js';

const router = express.Router();
export default (io) => {
  router.post('/alert/visitor', (req, res) => createVisitorAlert(req, res, io));
  router.get('/', getNotifications);
  router.put('/:id/read', markNotificationAsRead);
  router.put('/read-all', markAllAsRead);
  return router;
};