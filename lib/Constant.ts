import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";

export const socialLinks = [
  {
    id: 1,
    icon: GitHubLogoIcon,
    name: "GitHub",
    url: "https://github.com/thakurdotdev",
  },
  {
    id: 2,
    icon: TwitterLogoIcon,
    name: "Twitter",
    url: "https://x.com/thakurdotdev",
  },
  {
    id: 3,
    icon: LinkedInLogoIcon,
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/thakurdotdev",
  },
];

export const tabs = [
  {
    title: "Profile",
    link: "/",
  },
  {
    title: "Contact",
    link: "/contact",
  },
  // {
  //   title: "Store",
  //   link: "/store"
  // }
];

export const ProjectData = [
  {
    title: "FaceGram: A Social Media App",
    description:
      "A social media app that allows users to create profiles, connect with friends, and share photos, also allowing users to search for friends and view their profiles and chat with them in real-time.",
    techstack: [, "React", "Node", "Express", "PostgreSQL", "Material UI", "Socket.io"],
    live: "https://social.thakur.dev",
    github: "https://github.com/thakurdotdev/facegraam",
  },
  {
    title: "Find Your Job: A Job Search App",
    description:
      "A MERN stack application where users can search for jobs and apply for them, also you can post job offers and view them.",
    techstack: ["MERN Stack", "React", "Node", "Express", "MongoDB"],
    live: "https://findyourjob.vercel.app",
    github: "https://github.com/thakurdotdev/FindYourJob",
  },
  {
    title: "AI Article Summariser",
    description:
      "An AI article summariser that uses an external API to summarize articles.",
    techstack: ["React", "Redux", "Article Summarizer API"],
    live: "https://summarizearticle.netlify.app/",
    github: "https://github.com/thakurdotdev/ai-summariser",
  },
  // {
  //   title: "MERN Blog App",
  //   description:
  //     "A blog website where users can read, write, and delete blogs.",
  //   techstack: ["React", "Node", "Express", "MongoDB", "Tailwind CSS"],
  //   live: "https://pankajktechblog.vercel.app/",
  //   github: "https://github.com/thakurdotdev/Blog-Website",
  // },
];
