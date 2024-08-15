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

export const companiesData = [
  {
    companyLogo: "./netclues.jpg",
    company: "Netclues Technologies Pvt. Ltd.",
    location: "Ahmedabad, India",
    jobs: [
      {
        position: "Software Developer Intern",
        duration: "Feb 2024 - Present",
      },
    ],
  },
];

export const educationData = [
  {
    institution: "Gujarat Technological University",
    degree: "Bachelor of Engineering",
    stream: "Computer Engineering",
    duration: "2020 - 2024",
    logo: "/gtu.jpg",
  },
  {
    institution: "Bihar State Examination Board",
    degree: "Intermediate",
    stream: "Science",
    duration: "2018 - 2020",
    logo: "/bseb.jpg",
  },
];

export const ProjectData = [
  {
    title: "FaceGram: A Social Media App",
    description:
      "A social media app that allows users to create profiles, connect with friends, and share photos, also allowing users to search for friends and view their profiles and chat with them in real-time.",
    techstack: [
      ,
      "React",
      "Node",
      "Express",
      "PostgreSQL",
      "Material UI",
      "Socket.io",
    ],
    live: "https://social.thakur.dev",
    github: "https://github.com/thakurdotdev/facegraam",
  },
  {
    title: "Find Your Job: A Job Search App",
    description:
      "A MERN stack application where users can search for jobs and apply for them, also you can post job offers and view them.",
    techstack: ["MERN Stack", "React", "Node", "Express", "MongoDB"],
    live: "https://jobs.thakur.dev",
    github: "https://github.com/thakurdotdev/FindYourJob",
  },
  {
    title: "AI Article Summariser",
    description:
      "An AI article summariser that uses an external API to summarize articles.",
    techstack: ["React", "Redux", "Article Summarizer API"],
    live: "https://ai.thakur.dev",
    github: "https://github.com/thakurdotdev/ai-summariser",
  },
];

export const skillsData = [
  //   {
  //     name: "Next.js",
  //     iconUrl: "https://d26c7l40gvbbg2.cloudfront.net/tool_icons/nextjs.svg",
  //   },
  {
    name: "React",
    iconUrl: "https://d26c7l40gvbbg2.cloudfront.net/tool_icons/reactjs.svg",
  },
  {
    name: "Node.js",
    iconUrl: "https://d26c7l40gvbbg2.cloudfront.net/tool_icons/nodejs.svg",
  },
  {
    name: "TypeScript",
    iconUrl: "https://d26c7l40gvbbg2.cloudfront.net/tool_icons/typescript.svg",
  },
  {
    name: "JavaScript",
    iconUrl: "https://d26c7l40gvbbg2.cloudfront.net/tool_icons/javascript.svg",
  },
  { name: "Express.js", iconUrl: "" }, // Add the correct URL for Express.js icon
  {
    name: "PostgreSQL",
    iconUrl: "https://d26c7l40gvbbg2.cloudfront.net/tool_icons/postgresql.svg",
  },
  //   { name: "Docker", iconUrl: "" }, // Add the correct URL for Docker icon
  {
    name: "HTML5",
    iconUrl: "https://d26c7l40gvbbg2.cloudfront.net/tool_icons/html.svg",
  },
  { name: "CSS3", iconUrl: "" }, // Add the correct URL for CSS3 icon
  { name: "Sequelize", iconUrl: "" }, // Add the correct URL for Sequelize icon
  {
    name: "MongoDB",
    iconUrl: "https://d26c7l40gvbbg2.cloudfront.net/tool_icons/mongodb.svg",
  },
  {
    name: "MySQL",
    iconUrl: "https://d26c7l40gvbbg2.cloudfront.net/tool_icons/mysql.svg",
  },
  { name: "Tailwind CSS", iconUrl: "" }, // Add the correct URL for Tailwind CSS icon
  { name: "Material-UI", iconUrl: "" }, // Add the correct URL for Material-UI icon
  { name: "Socket.IO", iconUrl: "" }, // Add the correct URL for Socket.IO icon
  {
    name: "Git",
    iconUrl: "https://d26c7l40gvbbg2.cloudfront.net/tool_icons/git.svg",
  },
  { name: "GitHub", iconUrl: "" }, // Add the correct URL for GitHub icon
];
