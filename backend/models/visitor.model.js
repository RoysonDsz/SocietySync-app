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
  }
});

  const visitorModel = mongoose.model('Visitor', visitorSchema);

  export default visitorModel;