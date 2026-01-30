"use client";

import Image from "next/image";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

type Course = {
  _id: string;
  title: string;
  subTitle: string;
  description: string;
  courseThumbnail?: string;
  coursePrice: number;
};

type CourseCardProps = {
  course: Course;
};

const CourseCard = ({ course }: CourseCardProps) => {
  const router = useRouter();
  const { userId } = useAuth();

  const handleClick = () => {
    if (userId) {
      router.push(`/course-list/${course._id}`);
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <Card className="bg-white shadow-lg">
      <Image
        src={course.courseThumbnail || "/placeholder.png"}
        alt={course.title}
        width={400}
        height={200}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          {course.title}
        </h2>
        <p className="text-gray-600 mb-4">{course.subTitle}</p>
        <Button onClick={handleClick} className="cursor-pointer">
          Learn More
        </Button>
      </div>
    </Card>
  );
};

export default CourseCard;
