import asyncHandler from "../../middleware/asyncHandler.js";
import VideocallSchedule from "../../models/videocall/VideocallSchedule.js";

export const createVideocallSchedule = asyncHandler(async (req, res) => {
  const schedule = await VideocallSchedule.create(req.body);
  res.status(201).json({ success: true, data: schedule });
});

export const getVideocallSchedules = asyncHandler(async (req, res) => {
  const schedules = await VideocallSchedule.find().sort({ createdAt: -1 });
  res.json({ success: true, data: schedules });
});

export const updateVideocallScheduleStatus = asyncHandler(async (req, res) => {
  const schedule = await VideocallSchedule.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!schedule) {
    res.status(404);
    throw new Error("Video call schedule not found");
  }

  res.json({ success: true, data: schedule });
});
