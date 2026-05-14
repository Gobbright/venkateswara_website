import express from "express";
import {
  createVideoCall,
  deleteVideoCall,
  getVideoCalls,
  updateVideoCall,
} from "../../controllers/video-calls/videoCallController.js";

const router = express.Router();

router.route("/").get(getVideoCalls).post(createVideoCall);
router.route("/:id").put(updateVideoCall).delete(deleteVideoCall);

export default router;
