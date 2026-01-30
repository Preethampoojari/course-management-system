import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CourseLectureCard from "@/components/CourseLectureCard";
import { cookies } from "next/headers";
import { Lecture } from "@/types/lecture";
import { Metadata } from "next";
import connectDB from "@/lib/db";
import { Course } from "@/models/Course";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}): Promise<Metadata> {
  const { courseId } = await params;
  await connectDB();

  const course = await Course.findById(courseId);

  return {
    title: course?.title || "Course",
    description: course?.subtitle || "Course details",
    openGraph: {
      title: course?.title,
      description: course?.subtitle,
      images: [course?.courseThumbnail],
    },
  };
}

type Creator = {
  name?: string;
};

type Course = {
  _id: string;
  title: string;
  subTitle: string;
  description: string;
  courseThumbnail?: string;
  coursePrice: number;
  creator?: Creator;
};

async function getCourse(courseId: string): Promise<Course | null> {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${courseId}`,
    {
      cache: "no-store",
      headers: {
        Cookie: cookieHeader,
      },
    },
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data.course;
}

async function getLectures(courseId: string): Promise<Lecture[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${courseId}/lecture`,
    { cache: "no-store" },
  );

  if (!res.ok) return [];

  const data = await res.json();
  return data.lectures || [];
}

export default async function CourseDetails({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = await getCourse(courseId);
  const lectures = await getLectures(courseId);

  if (!course) {
    return (
      <div className="text-center mt-20 text-xl font-semibold">
        Course not found
      </div>
    );
  }

  return (
    <div className="bg-gray-100 md:p-10">
      <Card className="max-w-7xl rounded-md mx-auto bg-white shadow-md pt-5 mt-14">
        {/* header Section */}
        <div className="px-4 py-1">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Link href="/">
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full cursor-pointer"
                >
                  <ArrowLeft size={16} />
                </Button>
              </Link>
              <h1 className="md:text-2xl font-bold text-gray-800">
                {course.title}
              </h1>
            </div>
            <div className="flex space-x-4">
              <Button className="bg-blue-500 hover:bg-blue-600 cursor-pointer">
                Enroll Now
              </Button>
            </div>
          </div>
        </div>

        {/* Course overview section */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <Image
              src={course.courseThumbnail || "/placeholder.png"}
              alt={course.title}
              width={600}
              height={400}
              className="w-full lg:w-1/3 rounded-md mb-4 lg:mb-0 object-cover"
            />

            <div>
              <p className="text-gray-800 mb-4 font-semibold capitalize">
                {course.subTitle}
              </p>
              <p
                className="mb-4 text-gray-700"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
              <p className="text-gray-800 font-semibold">
                ⭐⭐⭐⭐⭐ (4.8) | 1,200 reviews
              </p>

              <div className="mt-1">
                <p className="text-2xl font-bold text-gray-800">
                  ₹{course.coursePrice}
                </p>
                <p className="text-gray-500 line-through">₹599</p>
              </div>

              <ul className="mt-6 space-y-2 text-gray-700">
                <li>✅ 30+ hours of video content</li>
                <li>✅ Lifetime access to course materials</li>
                <li>✅ Certificate of completion</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Course Details Section */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            What You will Learn
          </h2>

          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Build dynamic web applications with React and Node.js</li>
            <li>Deploy websites with modern tools like Vercel and Netlify</li>
            <li>Understand REST APIs and database integration</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-800 mt-6 mb-4">
            Requirements
          </h2>

          <p className="text-gray-700">
            Basic programming knowledge is helpful but not required.
          </p>

          <h2 className="text-xl font-bold text-gray-800 mt-6 mb-4">
            Who This Course is For
          </h2>

          <p className="text-gray-700">
            Beginners, aspiring developers, and professionals looking to upgrade
            skills.
          </p>
        </div>

        {/* course lectures */}
        {lectures?.length == 0 ? null : (
          <CourseLectureCard lectures={lectures} />
        )}

        {/* instructor section */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Instructor</h2>
          <div className="flex items-center space-x-4">
            {/* <Image
              src={course.creator?.photoUrl || "/placeholder-avatar.png"}
              alt="instructor"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover"
            /> */}
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {course.creator?.name}
              </h3>
              <p className="text-gray-700">Senior Full-Stack Developer</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
