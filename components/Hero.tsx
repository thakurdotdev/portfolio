"use client";
import Link from "next/link";
import { File, User } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
import { PhoneSocial } from "./Social";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="py-16 min-h-[80vh] md:min-h-[85vh] flex items-center flex-col-reverse lg:flex-row gap-10 justify-center">
      <div className="flex flex-col gap-4 text-left lg:w-1/2 2xl:w-1/3 mx-6 xl:mx-0 ">
        <motion.p
          className="text-2xl font-bold text-light-blue-700"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Hey,
        </motion.p>
        <motion.p
          className="text-3xl md:text-5xl font-bold relative"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          I'm
          <span className="text-blue-500 ml-4 uppercase">Pankaj Kumar</span>
        </motion.p>
        <TypewriterEffectSmooth words={words} />
        <motion.p
          className="text-lg md:text-xl font-medium relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          I'm a Full Stack Developer based in India. I have a passion for web
          development and love to create for web apps.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <PhoneSocial />
        </motion.div>

        <div className="flex flex-row justify-center md:justify-normal gap-4 md:gap-6 mt-5">
          <Link href={"/about"}>
            <Button variant="secondary" className="flex gap-2 items-center">
              <User className="text-lg" />
              About Me
            </Button>
          </Link>
          <Link
            href="https://drive.google.com/file/d/1Yd3Z6GO8-vxHOldYckjj42sf8mjP2SgP/view?usp=drive_open"
            target="_blank"
          >
            <Button variant="secondary" className="flex gap-2 items-center">
              <File className="text-lg" />
              Resume
            </Button>
          </Link>
          <ThemeSwitcher />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Image
          src="/pk.jpg"
          width={300}
          height={300}
          quality={80}
          loading="lazy"
          alt="Pankaj Kumar"
          className="rounded-full w-52 h-52 md:w-72 md:h-72 object-cover object-center shadow-lg"
        />
      </motion.div>
    </div>
  );
}

const words = [
  {
    text: "Full",
  },
  {
    text: "Stack",
  },
  {
    text: "Web",
  },
  {
    text: "Developer...",
  },
];
