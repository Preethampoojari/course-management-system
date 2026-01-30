import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Course } from "@/models/Course";
import "@/models/User";
import { auth } from "@clerk/nextjs/server";
import cloudinary from "@/lib/cloudinary";
import getDataUri from "@/lib/datauri";
import mongoose from "mongoose";
import "@/models/Lecture";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
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

    // Get courseId from URL
    const { courseId } = await params;

    // Check valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json(
        { message: "Invalid course ID", success: false },
        { status: 400 },
      );
    }

    // Find course
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return NextResponse.json(
        { message: "Course not found", success: false },
        { status: 404 },
      );
    }

    // Parse form-data (IMPORTANT)
    const formData = await req.formData();

    const courseTitle = formData.get("courseTitle") as string;
    const subTitle = formData.get("subTitle") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const courseLevel = formData.get("courseLevel") as string;
    const coursePrice = Number(formData.get("coursePrice"));
    const file = formData.get("file") as File | null;

    // Upload image to Cloudinary (if file exists)
    let courseThumbnail = course.courseThumbnail;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileUri = getDataUri({
        originalname: file.name,
        buffer,
      });

      const uploadResponse = await cloudinary.uploader.upload(fileUri);
      courseThumbnail = uploadResponse.secure_url;
    }

    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        title: courseTitle,
        subTitle,
        description,
        category,
        courseLevel,
        coursePrice,
        courseThumbnail,
      },
      { new: true },
    );

    // Response
    return NextResponse.json(
      {
        success: true,
        course: updatedCourse,
        message: "Course updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update course", success: false },
      { status: 500 },
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
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

    // Get courseId from URL
    const { courseId } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json(
        { message: "Invalid course ID", success: false },
        { status: 400 },
      );
    }

    //Find course
    const course = await Course.findById(courseId).populate("creator");

    if (!course) {
      return NextResponse.json(
        { message: "Course not found!", success: false },
        { status: 404 },
      );
    }

    //Success response
    return NextResponse.json(
      {
        success: true,
        course,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to get course", success: false },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    // Connect DB
    await connectDB();

    // Auth
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Get courseId
    const { courseId } = await params;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json(
        { success: false, message: "Invalid course ID" },
        { status: 400 },
      );
    }

    // Find course
    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 },
      );
    }

    // Toggle publish status
    course.isPublished = !course.isPublished;
    await course.save();

    // Response
    return NextResponse.json({
      success: true,
      message: course.isPublished
        ? "Course published successfully"
        : "Course unpublished successfully",
      isPublished: course.isPublished,
    });
  } catch (error) {
    console.error("PUBLISH COURSE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update course status" },
      { status: 500 },
    );
  }
}
