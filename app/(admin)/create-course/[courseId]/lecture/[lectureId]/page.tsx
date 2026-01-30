"use client";
import LectureTab from "@/components/LectureTab";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EditLecture() {
  const params = useParams();
  const courseId = params.courseId;
  return (
    <div className="p-10 md:pr-20 h-screen pt-28 w-screen">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Link href={`/create-course/${courseId}/lecture`}>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full cursor-pointer"
            >
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="font-bold text-xl">Update Your Lecture</h1>
        </div>
      </div>
      <LectureTab />
    </div>
  );
}
