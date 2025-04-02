import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: ['alert', 'info', 'success'], default: 'info' },
  read: { type: Boolean, default: false },
  buildingNumber: String,
  visitorName: String,
  visitTime: String
});
export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
