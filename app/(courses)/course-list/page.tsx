import CourseCard from "@/components/CourseCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Courses",
  description:
    "Browse all available courses including Next.js, Frontend, and MERN stack.",
};

type Course = {
  _id: string;
  title: string;
  subTitle: string;
  description: string;
  courseThumbnail?: string;
  coursePrice: number;
};

// Server-side data fetching
async function getPublishedCourses(): Promise<Course[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/courses/published`,
    {
      cache: "no-store", // always fresh data
    },
  );

  const data = await res.json();
  return data.courses || [];
}

export default async function CoursesPage() {
  const courses = await getPublishedCourses();

  return (
    <div className="bg-gray-100 pt-14">
      <div className="min-h-screen max-w-7xl mx-auto py-10">
        <div className="px-4">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Our Courses
          </h1>

          <p className="text-center text-gray-600 mb-12">
            Explore our curated courses to boost your skills and career.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
