// Correct Import
import mongoose, { Schema, model } from 'mongoose';

// Schema Definition
const buildingSchema = new Schema({
  buildingName: {
    type: String,
    required: [true, 'Building name is required'],
    trim: true,
  },
  buildingNumber: {
    type: String,
    required: [true, 'Building number is required'],
    trim: true,
  },
  numberOfFlats: {
    type: Number,
    required: [true, 'Number of flats is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
}, {
  timestamps: true,
});

// Model Definition
const buildingModel = model('Building', buildingSchema);

export default buildingModel;
