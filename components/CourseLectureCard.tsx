"use client";

import { PlayCircle, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";

type Lecture = {
  _id: string;
  lectureTitle: string;
  videoUrl: string;
  isPreviewFree?: boolean;
};

export default function CourseLectureCard({
  lectures,
}: {
  lectures: Lecture[];
}) {
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  useEffect(() => {
    console.log("✅ selectedLecture updated:", selectedLecture);
    console.log("🎥 Selected Video URL:", selectedLecture?.videoUrl);
  }, [selectedLecture]);

  return (
    <div className="p-6 border-t">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Course Curriculum
      </h2>

      <div className="flex flex-col md:flex-row gap-10">
        {/* LEFT SIDE */}
        <div className="flex-1 space-y-3">
          <p className="text-gray-700 italic mb-2">
            {lectures?.length} Lectures
          </p>

          {lectures?.map((lecture, index) => {
            const isLocked = lecture.isPreviewFree !== true;

            return (
              <div
                key={lecture._id}
                onClick={() => {
                  if (isLocked) return alert("🔒 This lecture is locked!");
                  if (!lecture.videoUrl) return alert("❌ Video not found!");
                  setSelectedLecture(lecture);
                }}
                className={`flex items-center gap-3 p-4 rounded-md transition
                  ${
                    isLocked
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
                  }
                `}
              >
                {lecture.isPreviewFree ? (
                  <PlayCircle size={20} className="text-green-600" />
                ) : (
                  <Lock size={20} className="text-red-500" />
                )}

                <p className="font-medium">
                  {index + 1}. {lecture.lectureTitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1">
          {selectedLecture ? (
            <VideoPlayer url={selectedLecture?.videoUrl} />
          ) : (
            <div className="h-62.5 flex items-center justify-center bg-gray-100 rounded-md text-gray-500">
              Select a free lecture to watch 🎥
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
