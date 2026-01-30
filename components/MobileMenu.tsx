"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

type Props = {
  role?: string;
};

export default function MobileMenu({ role }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger Icon */}
      <button onClick={() => setOpen(!open)} className="text-white">
        {open ? <X size={30} /> : <Menu size={30} />}
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-gray-900 text-white flex flex-col gap-6 p-6 z-50">
          <Link href="/" onClick={() => setOpen(false)}>
            Home
          </Link>

          <Link href="/course-list" onClick={() => setOpen(false)}>
            Courses
          </Link>

          {role === "admin" && (
            <Link href="/dashboard" onClick={() => setOpen(false)}>
              Admin
            </Link>
          )}

          <SignedOut>
            <SignUpButton>
              <Button variant="secondary">Create Account</Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      )}
    </div>
  );
}
