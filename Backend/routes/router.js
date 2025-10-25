import express from "express";

import { authenticateUser } from "../Middleware/authentication.js";
import { loginUser, Signup } from "../Controller/authController.js";
import { addComplaint, deleteComplaint, getAllComplaints, getUserComplaints, updateComplaint, userUpdateComplaint } from "../Controller/complaintController.js";

const router = express.Router();


router.post("/signup", Signup);
router.post("/login", loginUser);

router.post("/addComplaint", authenticateUser, addComplaint);
router.get("/getUserComplaints", authenticateUser, getUserComplaints);
router.get("/getAllComplaints", authenticateUser, getAllComplaints);
router.put("/updateComplaint/:id", authenticateUser, updateComplaint);
router.put("/userUpdateComplaint/:id", authenticateUser, userUpdateComplaint);
router.delete("/deleteComplaint/:id", authenticateUser, deleteComplaint);


export default router;
