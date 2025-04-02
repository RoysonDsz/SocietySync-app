  import mongoose from 'mongoose';

  const signupSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
      },
      role: {
        type: String,
        enum: ['resident', 'admin', 'president', 'watchman'],
        default: 'resident',
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
      },
      buildingName:{
        type: String,
        required: true
    },
      password: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
        unique: true,
      },
    }, {
      timestamps: true,
    });

    const signupModel = mongoose.model('Signup', signupSchema);


    export default signupModel;