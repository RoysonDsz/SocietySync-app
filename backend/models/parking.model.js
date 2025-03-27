import mongoose from 'mongoose';

const parkingSchema = new mongoose.Schema({
    vehicleNumber: { 
        type: String, 
        required: true 
    },
    residentName: { 
        type: String, 
        required: true 
    },
    residentNumber: { 
        type: String, 
        required: true 
    },
    slotNumber: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Occupied', 'Available'], 
        required: true ,
        default: 'Available'
    },
  }, { timestamps: true });

  const parkingModel = mongoose.model('Parking', parkingSchema);

  export default parkingModel;