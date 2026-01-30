import EditCourseTab from "@/components/EditCourseTab";
import { Button } from "@/components/ui/button";
import mongoose from "mongoose";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EditCourse({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    redirect("/create-course");
  }

  return (
    <div className="md:pt-26 p-20 px-10 w-full min-h-screen">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-xl">
          Add detail information regarding course
        </h1>
        <Link href={`${courseId}/lecture`}>
          <Button className="hover:text-blue-600 cursor-pointer">
            Go to lecture page
          </Button>
        </Link>
      </div>
      <EditCourseTab courseId={courseId} />
    </div>
  );
}
