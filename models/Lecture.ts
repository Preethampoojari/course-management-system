import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    lectureTitle: { type: String, required: true },
    videoUrl: { type: String },
    publicId: { type: String },
    isPreviewFree: { type: Boolean, default: false },
    // course: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Course",
    // },
  },
  { timestamps: true },
);

export const Lecture =
  mongoose.models.Lecture || mongoose.model("Lecture", lectureSchema);
