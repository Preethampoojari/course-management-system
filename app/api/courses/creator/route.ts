import { NextResponse } from "next/server";
import { Course } from "@/models/Course";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import "@/models/Lecture";

export async function GET() {
  try {
    // CONNECTING DATABASE
    await connectDB();

    // Get logged-in user from Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 },
      );
    }

    // Find courses created by this user
    const dbUser = await User.findOne({ clerkId: userId });

    if (!dbUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 },
      );
    }

    const courses = await Course.find({ creator: dbUser?._id }).populate(
      "lectures",
    );

    // If no courses found
    if (!courses || courses.length === 0) {
      return NextResponse.json(
        {
          message: "Course not found",
          courses: [],
          success: false,
        },
        { status: 404 },
      );
    }

    // Success response
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
