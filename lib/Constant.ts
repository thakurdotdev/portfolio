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

export const companiesData = [
	{
		companyLogo:
			"https://scontent.famd4-1.fna.fbcdn.net/v/t39.30808-1/341250460_746637277185106_6312355967036338054_n.jpg?stp=dst-jpg_p200x200&_nc_cat=105&ccb=1-7&_nc_sid=f4b9fd&_nc_ohc=Q1g7F2BWP_AQ7kNvgGZMC-n&_nc_ht=scontent.famd4-1.fna&oh=00_AYBcnIdvLyzfR2dVGgT3tX1ojKuVrTgfy6uiuPAXezAh9g&oe=669E9FCA",
		company: "Netclues Technologies Pvt. Ltd.",
		location: "Ahmedabad, India",
		jobs: [
			{
				position: "Junior Software Developer",
				duration: "Aug 2024 - Present",
				top: "20px",
				isCurrent: true,
			},
			{
				position: "Software Developer Intern",
				duration: "Feb 2024 - July 2024",
				top: "40px",
			},
		],
	},
	// Add more companies here
];

export const educationData = [
	{
		institution: "Gujarat Technological University",
		degree: "Bachelor of Engineering",
		duration: "2020 - 2024",
		logo: "https://scontent.famd4-1.fna.fbcdn.net/v/t39.30808-1/299624191_5604306519633160_7970186020195724104_n.jpg?stp=dst-jpg_p200x200&_nc_cat=101&ccb=1-7&_nc_sid=f4b9fd&_nc_ohc=k-5fxpU4ynQQ7kNvgGz-Q60&_nc_ht=scontent.famd4-1.fna&oh=00_AYDvqIRzZSj5McIE1RyB2o0oHiymck95G57f4QA6BfQsMg&oe=669E84CB",
	},
	{
		institution: "Bihar State Examination Board",
		degree: "Intermediate",
		duration: "2018 - 2020",
		logo: "https://scontent.famd4-1.fna.fbcdn.net/v/t39.30808-1/343562402_250660047344824_2801684525784007461_n.jpg?stp=dst-jpg_p200x200&_nc_cat=101&ccb=1-7&_nc_sid=f4b9fd&_nc_ohc=8zVyONCxnHkQ7kNvgH-CMwQ&_nc_ht=scontent.famd4-1.fna&oh=00_AYAvGArqTsdePkfYi6Hqks-FHfCmAneFJnBHb8SdGKNZjA&oe=669E97F5",
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
