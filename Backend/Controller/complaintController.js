import Complaint from "../Model/Complaint.js";
import User from "../Model/Signup.js";

// ---------------- Add Complaint ----------------
export const addComplaint = async (req, res) => {
  try {
    const { title, description, category, visibility } = req.body;
    const complaint = new Complaint({
      user: req.user._id,
      title,
      description,
      category,
      visibility,
    });
    await complaint.save();
    res.status(201).json({ message: "Complaint submitted", complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ---------------- Get All Complaints (Admin) ----------------
export const getAllComplaints = async (req, res) => {
  try {
    // Admin sees all complaints
    const complaints = await Complaint.find()
      .populate("user", "name email") // Show who submitted
      .populate("history.updatedBy", "name email"); // Show who updated

    res.status(200).json({ complaints });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ---------------- Get Complaints for User ----------------
export const getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      $or: [
        { user: req.user._id },
        { visibility: "public" }
      ]
    }).populate("user", "name email").populate("history.updatedBy", "name email");
    
    res.status(200).json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- Update Complaint (Admin) ----------------
export const updateComplaint = async (req, res) => {
  try {
    const { status, solvingInchargeName, solvingInchargeEmail } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    // Update history
    complaint.history.push({
      status,
      updatedBy: req.user._id
    });

    // Update fields
    complaint.status = status || complaint.status;
    if (solvingInchargeName) complaint.solvingIncharge.name = solvingInchargeName;
    if (solvingInchargeEmail) complaint.solvingIncharge.email = solvingInchargeEmail;

    await complaint.save();
    res.status(200).json({ message: "Complaint updated", complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const userUpdateComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      visibility,
      status,
      solvingInchargeName,
      solvingInchargeEmail,
    } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Record update history (even if multiple fields change)
    complaint.history.push({
      status: status || complaint.status,
      updatedBy: req.user._id,
      updatedAt: Date.now(),
    });

    // ✅ Update all allowed fields
    if (title) complaint.title = title;
    if (description) complaint.description = description;
    if (category) complaint.category = category;
    if (visibility) complaint.visibility = visibility;
    if (status) complaint.status = status;

    // Solving Incharge info
    if (solvingInchargeName) complaint.solvingIncharge.name = solvingInchargeName;
    if (solvingInchargeEmail) complaint.solvingIncharge.email = solvingInchargeEmail;

    await complaint.save();

    res.status(200).json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ---------------- Delete Complaint (Admin) ----------------
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    res.status(200).json({ message: "Complaint deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
