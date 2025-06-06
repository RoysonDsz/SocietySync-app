import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['resident', 'admin', 'president', 'watchman'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }, {
    timestamps: true,
  });

  const notificationModel = mongoose.model('Notification', notificationSchema);


  export default notificationModel;



