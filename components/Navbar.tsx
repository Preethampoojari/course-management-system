import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { auth } from "@clerk/nextjs/server";
import { Roles } from "@/types/global";

const Navbar = async () => {
  const { sessionClaims } = await auth();

  const role = sessionClaims?.metadata?.role;
  const allowedRoles: Roles[] = ["admin", "moderator"];

  return (
    <div className="bg-gray-900 z-50 w-full py-3 fixed top-0">
      <div className="max-w-7xl mx-auto flex justify-between">
        <Link href="/">
          <div className="flex gap-1">
            <GraduationCap className="text-gray-300 w-10 h-10" />
            <h1 className="text-gray-300 text-3xl font-bold">CMS</h1>
          </div>
        </Link>

        <nav>
          <ul className="flex gap-7 text-xl items-center font-semibold text-white">
            <Link href="/">
              <li className="text-gray-300 ">Home</li>
            </Link>
            <Link href="/course-list">
              <li className="text-gray-300 ">Course</li>
            </Link>
            {role && allowedRoles.includes(role) && (
              <Link href="/dashboard">
                <li className="text-gray-300">Admin</li>
              </Link>
            )}

            <SignedOut>
              <SignUpButton>
                <Button variant="secondary" className="cursor-pointer">
                  Create Account
                </Button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
