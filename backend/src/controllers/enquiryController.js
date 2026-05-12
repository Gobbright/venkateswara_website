import asyncHandler from "../middleware/asyncHandler.js";
import Enquiry from "../models/Enquiry.js";

export const createEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.create(req.body);
  res.status(201).json({ success: true, data: enquiry });
});

export const getEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 });
  res.json({ success: true, data: enquiries });
});
