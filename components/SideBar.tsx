"use client";

import { ChartColumnBig, FolderPlus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const SideBar = () => {
  const pathname = usePathname();
  const { sessionClaims } = useAuth();

  return (
    <div className="bg-gray-700 w-80 h-screen hidden md:block sticky top-0">
      <div className="text-center pt-10 px-3 space-y-2">
        <Link
          href="/dashboard"
          className={`text-2xl text-gray-300 ${
            pathname === "/dashboard" ? "bg-gray-950" : "bg-transparent"
          } flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}
        >
          <ChartColumnBig />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/create-course"
          className={`text-2xl text-gray-300 ${
            pathname.startsWith("/create-course")
              ? "bg-gray-950"
              : "bg-transparent"
          } flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}
        >
          <FolderPlus />
          <span>Course</span>
        </Link>

        {sessionClaims?.metadata?.role === "admin" && (
          <Link
            href="/roles"
            className={`text-2xl text-gray-300 ${
              pathname === "/roles" ? "bg-gray-950" : "bg-transparent"
            } flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}
          >
            <ShieldCheck />
            <span>Roles</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default SideBar;
