import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Course } from "@/models/Course";
import { Lecture } from "@/models/Lecture";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    // 1) Connect Database
    await connectDB();

    // 2) Clerk Authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 },
      );
    }

    // 3) Get courseId from URL
    const { courseId } = await params;

    // 4) Validate courseId (MongoDB ObjectId check)
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json(
        { message: "Invalid course ID", success: false },
        { status: 400 },
      );
    }

    // 5) Get request body
    const body = await req.json();
    const { lectureTitle } = body;

    if (!lectureTitle) {
      return NextResponse.json(
        { message: "Lecture title is required", success: false },
        { status: 400 },
      );
    }

    // 6) Create Lecture
    const lecture = await Lecture.create({ lectureTitle });

    // 7) Find Course
    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json(
        { message: "Course not found", success: false },
        { status: 404 },
      );
    }

    // 8) Push lecture into course
    course.lectures.push(lecture._id);
    await course.save();

    // 9) Response
    return NextResponse.json(
      {
        success: true,
        lecture,
        message: "Lecture created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create lecture", success: false },
      { status: 500 },
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    // 1) Connect DB
    await connectDB();

    // const { userId } = await auth();
    // if (!userId) {
    //   return NextResponse.json(
    //     { message: "Unauthorized", success: false },
    //     { status: 401 },
    //   );
    // }

    // 3) Get courseId
    const { courseId } = await params;

    // 4) Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json(
        { message: "Invalid course ID", success: false },
        { status: 400 },
      );
    }

    // 5) Find course + populate lectures
    const course = await Course.findById(courseId).populate("lectures");

    if (!course) {
      return NextResponse.json(
        { message: "Course not found", success: false },
        { status: 404 },
      );
    }

    // 6) Return lectures
    return NextResponse.json(
      {
        success: true,
        lectures: course.lectures,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { message: "Failed to get lectures", success: false },
      { status: 500 },
    );
  }
}
