import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String },
    role: {
      type: String,
      enum: ["admin", "moderator", "student"],
      default: "moderator",
    },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true },
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
