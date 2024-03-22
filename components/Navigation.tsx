"use client";

import { Code, Folder, GraduationCap, Home, Mail, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Data = [
  {
    label: "Home",
    value: "Home",
    icon: Home,
    desc: "Home",
    src: "/",
  },
  {
    label: "About",
    value: "About",
    icon: User,
    desc: "About",
    src: "/about",
  },
  {
    label: "Skills",
    value: "Skills",
    icon: Code,
    desc: "Skills",
    src: "/skills",
  },
  {
    label: "Projects",
    value: "Projects",
    icon: Folder,
    desc: "Projects",
    src: "/projects",
  },
  {
    label: "Experience",
    value: "Experience",
    icon: GraduationCap,
    desc: "Experience",
    src: "/experience",
  },
  {
    label: "Contact",
    value: "Contact",
    icon: Mail,
    desc: "Contact",
    src: "/contact",
  },
];

export default function Navigation() {
  const pathName = usePathname();
  return (
    <section className="fixed backdrop-blur-md bottom-0 w-full xl:bottom-5 lg:flex justify-center items-center z-50">
      <div className="md:rounded-full border  py-3 flex justify-center z-50 md:gap-1 shadow-xl">
        {Data.map(({ value, icon, src }) => (
          <Link href={src} key={value}>
            <div className="group relative px-3 cursor-pointer">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full hover:text-blue-500 transition-all",
                  pathName === src ? "text-blue-500" : ""
                )}
              >
                {React.createElement(icon)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
