import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Course } from "@/models/Course";
import { Lecture } from "@/models/Lecture";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; lectureId: string }> },
) {
  try {
    // Connect DB
    await connectDB();

    // Clerk Authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 },
      );
    }

    // Get params
    const { courseId, lectureId } = await params;

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(lectureId)
    ) {
      return NextResponse.json(
        { message: "Invalid course or lecture ID", success: false },
        { status: 400 },
      );
    }

    // get request body
    const body = await req.json();
    const { lectureTitle, videoInfo, isPreviewFree } = body;

    const videoUrl = videoInfo?.videoUrl;
    const publicId = videoInfo?.publicId;

    // find lecture
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return NextResponse.json(
        { message: "Lecture not found", success: false },
        { status: 404 },
      );
    }

    // update lecture fields (only if provided)
    if (lectureTitle !== undefined) lecture.lectureTitle = lectureTitle;
    if (videoUrl !== undefined) lecture.videoUrl = videoUrl;
    if (publicId !== undefined) lecture.publicId = publicId;
    if (isPreviewFree !== undefined) lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    // ensure lecture exists in course
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { message: "Course not found", success: false },
        { status: 404 },
      );
    }

    const lectureExists = course.lectures.some(
      (id: mongoose.Types.ObjectId) => id.toString() === lecture._id.toString(),
    );

    if (!lectureExists) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    // Response
    return NextResponse.json(
      {
        success: true,
        lecture,
        message: "Lecture updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("EDIT LECTURE ERROR:", error);
    return NextResponse.json(
      { message: "Failed to edit lecture", success: false },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ lectureId: string }> },
) {
  try {
    // Connect Database
    await connectDB();

    // Clerk Authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 },
      );
    }

    // Get lectureId from URL
    const { lectureId } = await params;

    // Validate lectureId
    if (!mongoose.Types.ObjectId.isValid(lectureId)) {
      return NextResponse.json(
        { message: "Invalid lecture ID", success: false },
        { status: 400 },
      );
    }

    // Delete lecture
    const lecture = await Lecture.findByIdAndDelete(lectureId);

    if (!lecture) {
      return NextResponse.json(
        { message: "Lecture not found", success: false },
        { status: 404 },
      );
    }

    // Remove lecture reference from course
    await Course.updateOne(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } },
    );

    // Response
    return NextResponse.json(
      {
        success: true,
        message: "Lecture removed successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to remove lecture", success: false },
      { status: 500 },
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; lectureId: string }> },
) {
  try {
    await connectDB();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { lectureId } = await params;

    if (!mongoose.Types.ObjectId.isValid(lectureId)) {
      return NextResponse.json(
        { success: false, message: "Invalid lecture ID" },
        { status: 400 },
      );
    }

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return NextResponse.json(
        { success: false, message: "Lecture not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, lecture }, { status: 200 });
  } catch (error) {
    console.error("GET LECTURE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch lecture" },
      { status: 500 },
    );
  }
}
