"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AddCourse() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const createCourseHandler = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseTitle, category }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        router.push("/create-course"); // redirect
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 md:pr-20 h-screen pt-28">
      <h1 className="text-2xl font-bold">
        Lets Add <span className="text-blue-500">Courses</span>
      </h1>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </p>

      <div className="mt-10">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Your Course Name"
            className="bg-white mt-2"
          />
        </div>

        <div className="mt-4 mb-5">
          <Label className="mb-2">Category</Label>
          <Select onValueChange={setCategory}>
            <SelectTrigger className="w-full max-w-48 bg-white">
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
                <SelectItem value="JavaScript">JavaScript</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="Docker">Docker</SelectItem>
                <SelectItem value="MongoDB">MongoDB</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => router.push("/create-course")}
            variant="outline"
            className="cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
            onClick={createCourseHandler}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-1 h-4 w-4" />
                Please wait
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
