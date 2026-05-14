import asyncHandler from "../../middleware/asyncHandler.js";
import VideoCall from "../../models/video-calls/VideoCall.js";

export const getVideoCalls = asyncHandler(async (req, res) => {
  const videoCalls = await VideoCall.find().sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: videoCalls });
});

export const createVideoCall = asyncHandler(async (req, res) => {
  const videoCall = await VideoCall.create(req.body);
  res.status(201).json({ success: true, data: videoCall });
});

export const updateVideoCall = asyncHandler(async (req, res) => {
  const videoCall = await VideoCall.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!videoCall) {
    res.status(404);
    throw new Error("Video call not found");
  }

  res.json({ success: true, data: videoCall });
});

export const deleteVideoCall = asyncHandler(async (req, res) => {
  const videoCall = await VideoCall.findByIdAndDelete(req.params.id);

  if (!videoCall) {
    res.status(404);
    throw new Error("Video call not found");
  }

  res.json({ success: true, data: videoCall });
});
