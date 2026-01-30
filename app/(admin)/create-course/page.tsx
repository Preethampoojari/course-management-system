import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";

type Course = {
  _id: string;
  title: string;
  courseThumbnail: string;
  coursePrice: string;
  isPublished: boolean;
};

async function getCourses() {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/courses/creator`,
    {
      cache: "no-store",
      headers: {
        Cookie: cookieHeader,
      },
    },
  );

  if (!res.ok) return [];

  const data = await res.json();
  return data.courses || [];
}

export default async function Page() {
  const creatorCourse: Course[] = await getCourses();

  return (
    <div className="md:pt-26 pt-4 w-full min-h-screen px-10">
      <Link href="/create-course/add-course">
        <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
          Create Course
        </button>
      </Link>

      <Table className="mt-10">
        <TableCaption>A list of your recent courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">Course</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {creatorCourse.map((course) => (
            <TableRow key={course._id}>
              <TableCell className="md:w-75 flex items-center gap-2">
                <Image
                  src={
                    course?.courseThumbnail?.startsWith("http")
                      ? course.courseThumbnail
                      : "/placeholder.png"
                  }
                  alt="Thumbnail"
                  width={400}
                  height={600}
                  className="w-20 hidden md:block rounded-sm object-cover"
                  unoptimized
                />
                {course.title}
              </TableCell>

              <TableCell className="font-medium text-right">
                {course.coursePrice || "NA"}
              </TableCell>

              <TableCell className="text-center">
                <Badge
                  className={course.isPublished ? "bg-green-400" : "bg-red-400"}
                >
                  {course.isPublished ? "Published" : "Draft"}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <Link href={`/create-course/${course._id}`}>
                  <Button variant="ghost" className="cursor-pointer">
                    <Edit />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
