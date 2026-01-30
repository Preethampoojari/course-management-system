"use client";

import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function RichTextEditor({ value, onChange }: Props) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Write course description...",
      modules: {
        toolbar: [
          ["bold", "italic", "underline"],
          [{ header: [1, 2, 3, false] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
      },
    });

    quillRef.current.on("text-change", () => {
      const html = editorRef.current!.querySelector(".ql-editor")!.innerHTML;
      onChange(html);
    });
  }, []);

  useEffect(() => {
    if (quillRef.current) {
      const editor = editorRef.current!.querySelector(".ql-editor");
      if (editor && editor.innerHTML !== value) {
        editor.innerHTML = value;
      }
    }
  }, [value]);

  return <div ref={editorRef} className="bg-white rounded-md" />;
}
