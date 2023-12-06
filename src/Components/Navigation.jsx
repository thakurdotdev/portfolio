import React from "react";
import { FaHome, FaLaptopCode, FaReact } from "react-icons/fa";
import { MdEmail, MdPersonOutline } from "react-icons/md";
import { HiOutlineBriefcase } from "react-icons/hi";
import { Link } from "react-router-dom";

const Data = [
  {
    label: "Home",
    value: "Home",
    icon: FaHome,
    desc: "Home",
    src: "/",
  },
  {
    label: "About",
    value: "About",
    icon: MdPersonOutline,
    desc: "About",
    src: "/about",
  },
  {
    label: "Skills",
    value: "Skills",
    icon: FaLaptopCode,
    desc: "Skills",
    src: "/skills",
  },
  {
    label: "Projects",
    value: "Projects",
    icon: FaReact,
    desc: "Projects",
    src: "/projects",
  },
  {
    label: "Experience",
    value: "Experience",
    icon: HiOutlineBriefcase,
    desc: "Experience",
    src: "/experience",
  },
  {
    label: "Contact",
    value: "Contact",
    icon: MdEmail,
    desc: "Contact",
    src: "/contact",
  },
];

const Navigation = () => {
  return (
    <section className="fixed bottom-0 w-full xl:bottom-5 lg:flex justify-center items-center z-50">
      <div className=" bg-white rounded-2xl border border-gray-300 py-3 flex justify-center z-50 md:gap-1 shadow-xl">
        {Data.map(({ label, value, icon, src }) => (
          <Link to={src} key={value}>
            <div className="group relative px-3 cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-full hover:text-blue-500">
                {React.createElement(icon, { className: "text-2xl" })}
              </div>
              <span className="absolute -top-8 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                {label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Navigation;
