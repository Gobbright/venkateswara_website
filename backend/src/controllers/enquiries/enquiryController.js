import asyncHandler from "../../middleware/asyncHandler.js";
import Enquiry from "../../models/enquiries/Enquiry.js";

export const createEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.create(req.body);
  res.status(201).json({ success: true, data: enquiry });
});

export const getEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: enquiries });
});

export const deleteEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

  if (!enquiry) {
    res.status(404);
    throw new Error("Enquiry not found");
  }

  res.json({ success: true, data: enquiry });
});
