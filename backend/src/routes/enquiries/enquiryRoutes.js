import express from "express";
import {
  createEnquiry,
  deleteEnquiry,
  getEnquiries,
} from "../../controllers/enquiries/enquiryController.js";

const router = express.Router();

router.route("/").get(getEnquiries).post(createEnquiry);
router.route("/:id").delete(deleteEnquiry);

export default router;
