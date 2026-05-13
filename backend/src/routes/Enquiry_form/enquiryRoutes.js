import express from "express";
import { createEnquiry, getEnquiries } from "../../controllers/Enquiry_form/enquiryController.js";

const router = express.Router();

router.route("/").get(getEnquiries).post(createEnquiry);

export default router;
