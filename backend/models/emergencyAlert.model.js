import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  title: String,
  message: String,
  level: { type: String, enum: ['fire', 'maintenance', 'security', 'medical', 'other'] },
  location: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectReason: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Alert', alertSchema);
