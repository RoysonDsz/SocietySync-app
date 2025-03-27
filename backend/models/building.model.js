import mongoose from 'mongoose';

const buildingSchema = new mongoose.Schema({
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    presidentName: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfFlats:{
      type: String,
      required: true
    },
    buildingNumber: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    buildingName: {
      type: String,
      required: true,
      trim: true,
    },
  }, {
    timestamps: true,
  });

  
  const buildingModel = mongoose.model('Building', buildingSchema);

export default buildingModel;