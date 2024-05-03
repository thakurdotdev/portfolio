import Link from "next/link";
import { File, User } from "lucide-react";
import NextImage from "@/components/NextImage";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { PhoneSocial } from "@/components/Social";



export default function Home() {
  return (
    <div className="py-16 min-h-[80vh] animate_in  md:min-h-[85vh] flex items-center flex-col-reverse lg:flex-row gap-10 justify-center">
      <div className="flex flex-col gap-4 text-left lg:w-1/2 2xl:w-1/3 mx-6 xl:mx-0 ">
        <p className="text-2xl font-bold text-light-blue-700">Hey,</p>
        <p className="text-3xl md:text-5xl font-bold relative">
          I'm
          <span className="text-blue-500 ml-4 uppercase">Pankaj Kumar</span>
        </p>
        <p className="text-3xl md:text-4xl font-bold text-light-blue-500">
          Full Stack Developer
        </p>
        <p className="text-lg md:text-xl font-medium relative">
          I'm a Full Stack Developer based in India. I have a passion for web
          development and love to create for web apps.
        </p>
       
          <PhoneSocial />
        
        <div className="flex flex-row justify-center md:justify-normal gap-4 md:gap-6 mt-5">
          <Link href={"/about"}>
            <Button variant="secondary" className="flex rounded-full gap-2 items-center">
              <User className="text-lg" />
              About Me
            </Button>
          </Link>
          <Link
            href="https://drive.google.com/file/d/1Yd3Z6GO8-vxHOldYckjj42sf8mjP2SgP/view?usp=drive_open"
            target="_blank"
          >
            <Button variant="secondary" className="flex rounded-full gap-2 items-center">
              <File className="text-lg" />
              Resume
            </Button>
          </Link>
          <ThemeSwitcher />
        </div>
      </div>

      <div>
        <NextImage
          src="/pk.webp"
          width={""}
          height={""}
          alt="Pankaj Kumar"
          className="rounded-full w-52 h-52 md:w-72 md:h-72 shadow-lg"
        />
      </div>
    </div>
  )
}
