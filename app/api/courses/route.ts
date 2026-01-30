import { NextRequest, NextResponse } from "next/server";
import { Course } from "@/models/Course";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    // CONNECTING DATABASE
    await connectDB();

    // Get user from Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 },
      );
    }

    // Get user data from Clerk
    const user = await currentUser();
    const role = user?.publicMetadata?.role as string;

    // Role check (RBAC)
    if (role !== "admin" && role !== "moderator") {
      return NextResponse.json(
        {
          message: "Forbidden: Only admin or moderator can create courses",
          success: false,
        },
        { status: 403 },
      );
    }

    // Get request body
    const body = await req.json();
    const { courseTitle, category } = body;

    // Validation
    if (!courseTitle || !category) {
      return NextResponse.json(
        {
          message: "Course title and category is required",
          success: false,
        },
        { status: 400 },
      );
    }

    const dbUser = await User.findOne({ clerkId: userId });

    if (!dbUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 },
      );
    }

    // Create course in DB
    const course = await Course.create({
      title: courseTitle, // match your schema field name
      category,
      creator: dbUser._id, // MongoDB ObjectId
    });

    // Success response
    return NextResponse.json(
      {
        success: true,
        course,
        message: "Course created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to create course",
        success: false,
      },
      { status: 500 },
    );
  }
}
