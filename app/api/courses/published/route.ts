import { NextResponse } from "next/server";
import { Course } from "@/models/Course";
import connectDB from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    // Get all published courses
    const courses = await Course.find({ isPublished: true });

    // If no courses found
    if (!courses || courses.length === 0) {
      return NextResponse.json(
        { message: "Course not found", success: false },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        courses,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to get course",
        success: false,
      },
      { status: 500 },
    );
  }
}
