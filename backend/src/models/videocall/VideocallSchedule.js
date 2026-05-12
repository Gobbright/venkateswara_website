import mongoose from "mongoose";

const videocallScheduleSchema = new mongoose.Schema(
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
    product: {
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
      enum: ["WhatsApp Video", "Google Meet / Zoom"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Scheduled", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const VideocallSchedule = mongoose.model(
  "VideocallSchedule",
  videocallScheduleSchema,
  "Videocall_schedule"
);

export default VideocallSchedule;
