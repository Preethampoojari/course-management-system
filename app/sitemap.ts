import connectDB from "@/lib/db";
import { Course } from "@/models/Course";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!;

export default async function sitemap() {
  await connectDB();

  const courses = await Course.find();

  const courseUrls = courses.map((course) => ({
    url: `${BASE_URL}/course-list/${course._id}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/course-list`,
      lastModified: new Date(),
    },
    ...courseUrls,
  ];
}
