import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["resident", "admin", "watchman", "president"],
      required: true,
    },
    complaint: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const complaintModel = mongoose.model("Complaint", complaintSchema);

export default complaintModel;
