import Hero from "@/components/Hero";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Course Management System",
  description:
    "Explore our online courses and manage your learning with our modern CMS platform.",
};

type Course = {
  _id: string;
  title: string;
  subTitle: string;
  description: string;
  courseThumbnail?: string;
  coursePrice: number;
};

async function getPublishedCourses(): Promise<Course[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/courses/published`,
    {
      cache: "no-store", // always fetch fresh data
    },
  );

  const data = await res.json();
  return data.courses || [];
}

export default async function Home() {
  const courses = await getPublishedCourses();

  return (
    <div>
      <Hero />

      <div className="px-5 pt-10">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Learn from the best
        </h1>

        <p className="text-center text-gray-600 mb-12">
          Discover our top-rated courses across various categories. From coding
          and design to business and wellness, our courses are crafted to
          deliver results.
        </p>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.slice(0, 4).map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>

        <div className="flex justify-center my-12">
          <Link href="/course-list">
            <button className="text-gray-500 border border-gray-500/30 px-10 py-3 rounded cursor-pointer">
              Show all Courses
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
