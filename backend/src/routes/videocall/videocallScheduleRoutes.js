import express from "express";
import {
  createVideocallSchedule,
  getVideocallSchedules,
  updateVideocallScheduleStatus,
} from "../../controllers/videocall/videocallScheduleController.js";

const router = express.Router();

router.route("/").get(getVideocallSchedules).post(createVideocallSchedule);
router.route("/:id/status").patch(updateVideocallScheduleStatus);

export default router;
