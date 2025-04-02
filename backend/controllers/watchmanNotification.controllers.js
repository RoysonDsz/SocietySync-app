import Notification from '../models/watchmanNotification.model.js';

export const createVisitorAlert = async (req, res, io) => {
  try {
    const { buildingNumber, visitorName, visitTime } = req.body;
    if (!buildingNumber || !visitorName || !visitTime) return res.status(400).json({ error: 'All fields are required' });

    const notification = await Notification.create({
      title: 'Visitor Entry Alert',
      message: `${visitorName} is expected to visit building/flat ${buildingNumber} at ${visitTime}`,
      type: 'info', buildingNumber, visitorName, visitTime
    });
    io.emit('newNotification', notification);
    res.status(201).json({ success: true, notification });
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ timestamp: -1 }).limit(50);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    console.error('Error marking as read:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({}, { read: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
