import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true
    },
    residentNumber: { 
        type: String, 
        required: true 
    },
    residentName: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    time: { 
        type: String, 
        required: true 
    },
    purpose: { 
        type: String, 
        required: true 
    },
  }, { timestamps: true });


  const eventModel = mongoose.model('Event', eventSchema);

  export default eventModel;