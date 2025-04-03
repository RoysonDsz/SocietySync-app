import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema({
  FlatNumber: {
    type: String,
    required: true,
  },
  visitorName: {
    type: String,
    required: true,
  },
  visitTime: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const visitorAlert = mongoose.model('Visitor Alert', VisitorSchema);

export default visitorAlert