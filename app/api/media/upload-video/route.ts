import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import getDataUri from "@/lib/datauri";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    // Clerk Authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Read form-data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 },
      );
    }

    // Convert file -> buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer -> dataUri
    const fileUri = getDataUri({
      originalname: file.name,
      buffer,
    });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileUri, {
      resource_type: "auto", // important for video
    });

    return NextResponse.json({
      success: true,
      message: "Video uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { success: false, message: "Error uploading video" },
      { status: 500 },
    );
  }
}
