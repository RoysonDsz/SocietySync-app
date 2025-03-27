import mongoose from "mongoose";

const assignSchema = new mongoose.Schema({
    residentName: {
        type: String,
        required: true
    },
    flatNumber: {
        type: String,
        required: true
    },
    buildingNumber:{
        type: String,
        required: true
    },
    residentNumber: {
        type: String,
        required: true
    },
    residentEmail:{
        type: String,
        required: true
    }
},{ timestamps: true });

const assignModel = mongoose.model('Flat', assignSchema);

export default assignModel