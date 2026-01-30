"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Edit } from "lucide-react";
import { toast } from "sonner";

type Lecture = {
  _id: string;
  lectureTitle: string;
};

export default function CreateLecturePage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();

  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [lectures, setLectures] = useState<Lecture[]>([]);

  const courseId = params.courseId;

  // CREATE LECTURE (POST)
  const createLectureHandler = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Lecture title is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/courses/${courseId}/lecture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lectureTitle }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success(data.message);

      setLectureTitle("");
      fetchLectures(); // refresh lectures list
    } catch (error) {
      console.error(error);
      toast.error("Failed to create lecture");
    } finally {
      setLoading(false);
    }
  };

  // GET LECTURES (GET)
  const fetchLectures = useCallback(async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}/lecture`);
      const data = await res.json();

      if (data.success) {
        setLectures(data.lectures);
      }
    } catch (error) {
      console.error(error);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchLectures();
    }
  }, [courseId, fetchLectures]);

  return (
    <div className="p-10 md:pr-20 h-screen pt-28">
      <h1 className="text-2xl font-bold mb-2">
        Lets Add <span className="text-blue-500">Lectures</span>
      </h1>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </p>

      <div className="mt-10 space-y-5">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            placeholder="Your Lecture Name"
            className="bg-white mt-2"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/create-course/${courseId}`)}
            variant="outline"
            className="cursor-pointer"
          >
            Back to Course
          </Button>

          <Button
            disabled={loading}
            onClick={createLectureHandler}
            className="bg-gray-800 hover:bg-gray-700 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>
      </div>

      {/* SHOWS LECTURES LIST */}
      <div className="mt-10">
        {lectures.map((lecture, index) => (
          <div
            key={lecture._id}
            className="flex items-center justify-between bg-[#F7F9FA] px-4 py-2 rounded-md my-2"
          >
            <h1 className="font-bold text-gray-800">
              Lecture - {index + 1}: {lecture.lectureTitle}
            </h1>

            <Edit
              onClick={() =>
                router.push(`/create-course/${courseId}/lecture/${lecture._id}`)
              }
              size={20}
              className="cursor-pointer text-gray-600 hover:text-blue-600"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
