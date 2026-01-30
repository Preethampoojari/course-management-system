"use client";

import { useEffect, useState } from "react";
import RichTextEditor from "./RichTextEditor";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

type Props = {
  courseId: string;
};

type CourseType = {
  _id: string;
  title: string;
  subTitle: string;
  description: string;
  category: string;
  courseLevel: string;
  coursePrice: number;
  courseThumbnail?: string;
  isPublished?: boolean;
};

export default function EditCourseTab({ courseId }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // form states
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [courseLevel, setCourseLevel] = useState("");
  const [coursePrice, setCoursePrice] = useState<number | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [isPublished, setIsPublished] = useState(false);

  // 1) Fetch course by ID
  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to load course");
          return;
        }

        const course: CourseType = data.course;

        // set form values
        setTitle(course.title || "");
        setSubTitle(course.subTitle || "");
        setDescription(course.description || "");
        setCategory(course.category || "");
        setCourseLevel(course.courseLevel || "");
        setCoursePrice(course.coursePrice || "");
        setThumbnailPreview(course.courseThumbnail || "");
        setIsPublished(course.isPublished || false);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong while loading course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // 2) Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setThumbnailPreview(URL.createObjectURL(selectedFile));
  };

  // 3) Validate form
  const validateForm = () => {
    if (!title.trim()) return "Title is required";
    if (!subTitle.trim()) return "Subtitle is required";
    if (!description.trim()) return "Description is required";
    if (!category) return "Category is required";
    if (!courseLevel) return "Course level is required";
    if (!coursePrice) return "Price is required";
    return null;
  };

  // 4) Submit update
  const handleUpdateCourse = async () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("courseTitle", title);
      formData.append("subTitle", subTitle);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("courseLevel", courseLevel);
      formData.append("coursePrice", String(coursePrice));

      if (file) {
        formData.append("file", file);
      }

      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update course");
        return;
      }

      toast.success("Course updated successfully");
      router.push("/create-course");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating course");
    } finally {
      setSaving(false);
    }
  };

  const togglePublishCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update publish status");
        return;
      }

      setIsPublished(data.isPublished);
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while publishing course");
    }
  };

  // Loading UI
  if (loading) {
    return (
      <Card>
        <CardContent className="p-10 text-center text-gray-500">
          Loading course data...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex md:flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to your course here. Click save when you are done.
          </CardDescription>
        </div>
        <div className="space-x-2">
          <Button onClick={togglePublishCourse} className="cursor-pointer">
            {isPublished ? "UnPublish" : "Publish"}
          </Button>

          <Button variant="destructive" className="cursor-pointer">
            Remove Course
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 mt-5">
          {/* Title */}
          <div>
            <Label className="mb-2">Title</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. Fullstack developer"
            />
          </div>

          {/* Subtitle */}
          <div>
            <Label className="mb-2">Subtitle</Label>
            <Input
              type="text"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              placeholder="Ex. Become a Fullstack developer in 2 months"
            />
          </div>

          {/* Description */}
          <div>
            <Label className="mb-2">Description</Label>
            <RichTextEditor value={description} onChange={setDescription} />
          </div>

          {/* Category + Level + Price */}
          <div className="flex md:flex-row flex-wrap gap-1 items-center md:gap-5">
            {/* Category */}
            <div>
              <Label className="mb-2">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Next Js">Next Js</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Frontend Development">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="Backend Development">
                      Backend Development
                    </SelectItem>
                    <SelectItem value="MernStack Development">
                      MernStack Development
                    </SelectItem>
                    <SelectItem value="Fullstack Development">
                      Fullstack Development
                    </SelectItem>
                    <SelectItem value="JavaScript">JavaScript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Level */}
            <div>
              <Label className="mb-2">Course Level</Label>
              <Select value={courseLevel} onValueChange={setCourseLevel}>
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div>
              <Label className="mb-2">Price (INR)</Label>
              <Input
                type="number"
                value={coursePrice}
                onChange={(e) => setCoursePrice(Number(e.target.value))}
                placeholder="199"
                className="w-fit"
              />
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <Label className="mb-2">Course Thumbnail</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />

            {thumbnailPreview && (
              <Image
                src={thumbnailPreview}
                alt="thumbnail"
                width={300}
                height={300}
                className="mt-2 object-cover rounded"
                unoptimized
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/create-course")}
              variant="outline"
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              onClick={handleUpdateCourse}
              disabled={saving}
              className="cursor-pointer"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
