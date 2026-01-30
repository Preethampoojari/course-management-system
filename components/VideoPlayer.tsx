"use client";

export default function VideoPlayer({ url }: { url?: string }) {
  if (!url) return null;

  const safeUrl = url.replace("http://", "https://");

  return (
    <video src={safeUrl} controls className="w-full h-80 rounded-lg bg-black" />
  );
}
