import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  visitorName: {
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
  purpose: {
    type: String,
    required: true,
  },
  buildingNumber:{
    type:String,
    required:true
  },
  checkIn: {
    type: Date,
    default: Date.now,
  },
  checkOut: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['checked-in', 'checked-out'],
    default: 'checked-in',
  },
  additionalNotes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

const visitorModel = mongoose.model('Visitor', visitorSchema);

export default visitorModel;