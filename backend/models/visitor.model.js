import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  residentName: {
    type: String,
    required: true,
  },
  visitorName: {
    type: String,
    required: true,
  },
  relation: {
    type: String,
    required: true,
  },
  flatNumber: {
    type: String,
    required: true,
  },
  visitorPhoneNumber: {
    type: String,
    required: true,
  },
  visitorVehicleNumber: {
    type: String,
    required: false,
  },
  purpose: {
    type: String,
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
    default: Date.now,
  },
  checkOut: {
    type: Date,
    required: false,
  },
});

  const visitorModel = mongoose.model('Visitor', visitorSchema);

  export default visitorModel;