import mongoose from "mongoose";

const videoCallSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    callType: {
      type: String,
      trim: true,
      default: "WhatsApp Video",
    },
    status: {
      type: String,
      enum: ["Scheduled", "Pending", "Completed"],
      default: "Scheduled",
    },
  },
  { timestamps: true }
);

const VideoCall = mongoose.model("VideoCall", videoCallSchema);

export default VideoCall;
