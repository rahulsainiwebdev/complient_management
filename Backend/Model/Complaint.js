import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: "General" },
  visibility: { type: String, enum: ["private", "public"], default: "private" },
  status: { type: String, enum: ["pending", "active", "complete", "rejected"], default: "pending" },
  solvingIncharge: {
    name: { type: String },
    email: { type: String }, // updated from contact to email
  },
  history: [
    {
      status: String,
      updatedAt: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
}, { timestamps: true });

export default mongoose.model("Complaint", complaintSchema);
