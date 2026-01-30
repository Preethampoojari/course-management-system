"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

type VideoInfo = {
  videoUrl: string;
  publicId: string;
};

type Lecture = {
  _id: string;
  lectureTitle: string;
  isPreviewFree: boolean;
};

export default function LectureTab() {
  const router = useRouter();
  const params = useParams<{ courseId: string; lectureId: string }>();

  const { courseId, lectureId } = params;

  const [lectureTitle, setLectureTitle] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isFree, setIsFree] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  // Fetch lecture details
  useEffect(() => {
    const fetchLecture = async () => {
      const res = await fetch(`/api/courses/${courseId}/lecture/${lectureId}`);

      if (!res.ok) {
        console.error("Failed to fetch lecture");
        return;
      }

      const data = await res.json();

      if (data.success) {
        const lecture: Lecture = data.lecture;
        setLectureTitle(lecture.lectureTitle);
        setIsFree(lecture.isPreviewFree);
      }
    };

    fetchLecture();
  }, [courseId, lectureId]);

  // upload video
  const fileChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setMediaLoading(true);

      const res = await fetch("/api/media/upload-video", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setVideoInfo({
          videoUrl: data.data.url,
          publicId: data.data.public_id,
        });
        toast.success("Video uploaded successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Video upload failed");
    } finally {
      setMediaLoading(false);
      setUploadProgress(100);
    }
  };

  // update lecture
  const editLectureHandler = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/courses/${courseId}/lecture/${lectureId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lectureTitle,
          videoInfo,
          isPreviewFree: isFree,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Lecture updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update lecture");
    } finally {
      setLoading(false);
    }
  };

  // Delete lecture
  const removeLectureHandler = async () => {
    try {
      setRemoveLoading(true);

      const res = await fetch(`/api/courses/${courseId}/lecture/${lectureId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Lecture deleted");
        router.push(`/create-course/${courseId}/lecture`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete lecture");
    } finally {
      setRemoveLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold">Edit Lecture</h2>

      <div>
        <Label className="mb-2">Title</Label>
        <Input
          value={lectureTitle}
          onChange={(e) => setLectureTitle(e.target.value)}
        />
      </div>

      <div>
        <Label className="mb-2">Video</Label>
        <Input type="file" accept="video/*" onChange={fileChangeHandler} />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={isFree}
          onCheckedChange={setIsFree}
          className="cursor-pointer"
        />
        <Label>Is this video FREE?</Label>
      </div>

      {mediaLoading && <Progress value={uploadProgress} />}

      <div className="flex gap-2">
        <Button
          disabled={loading}
          onClick={editLectureHandler}
          className="cursor-pointer"
        >
          {loading ? "Updating..." : "Update Lecture"}
        </Button>

        <Button
          variant="destructive"
          disabled={removeLoading}
          onClick={removeLectureHandler}
          className="cursor-pointer"
        >
          {removeLoading ? "Deleting..." : "Remove Lecture"}
        </Button>
      </div>
    </div>
  );
}
