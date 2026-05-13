import asyncHandler from "../../middleware/asyncHandler.js";
import Enquiry from "../../models/Enquiry_form/Enquiry.js";

export const createEnquiry = asyncHandler(async (req, res) => {
  const {
    name = "",
    phone = "",
    email = "",
    category = "",
    productDetails = "",
    branch = "",
    message = "",
  } = req.body;

  if (!name.trim() || !phone.trim()) {
    res.status(400);
    throw new Error("Name and phone number are required");
  }

  const enquiry = await Enquiry.create({
    name,
    phone,
    email,
    category,
    productDetails,
    branch,
    message,
  });

  res.status(201).json({ success: true, data: enquiry });
});

export const getEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 });
  res.json({ success: true, data: enquiries });
});
