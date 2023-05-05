import React, { useState } from "react";
import {
  Navbar,
  MobileNav,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import logo from "../assets/profile-pic.webp";

const Header = () => {
  const [openNav, setOpenNav] = useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      <Link to={"/about"} className="">
        <Button variant="text">About</Button>
      </Link>
      <Link to={"/skills"} className="">
        <Button variant="text">Skills</Button>
      </Link>
      <Link to={"/projects"} className="">
        <Button variant="text">Projects</Button>
      </Link>
      <Link to={"/experience"} className="">
        <Button variant="text">Experience</Button>
      </Link>
      <Link to={"/contact"} className="">
        <Button variant="text">Contact</Button>
      </Link>
    </ul>
  );

  return (
    <>
      <Navbar className="mx-auto max-w-screen-xl p-5 lg:rounded-full lg:pl-6">
        <div className="flex items-center justify-around text-blue-gray-900">
          <Link to={"/"}>
            <img
              src={logo}
              alt="logo"
              className="h-10 hover:bg-gray-500 duration-300 hover:rounded-full hover:p-1"
            />
          </Link>

          <div className="flex items-center gap-4">
            <div className="mr-4 hidden lg:block">{navList}</div>
            <a
              href="https://drive.google.com/file/d/1LxWA3Kpk3dGCbpK3OLjRGzHzeiFbm_7I/view"
              target="_blank"
            >
              <Button size="sm" className="hidden lg:inline-block">
                Resume
              </Button>
            </a>
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>
          </div>
        </div>
        <MobileNav open={openNav}>
          {navList}
          <a
            href="https://drive.google.com/file/d/1LxWA3Kpk3dGCbpK3OLjRGzHzeiFbm_7I/view"
            target="_blank"
          >
            <Button variant="gradient" size="sm" fullWidth className="mb-2">
              Resume
            </Button>
          </a>
        </MobileNav>
      </Navbar>
    </>
  );
};

export default Header;
