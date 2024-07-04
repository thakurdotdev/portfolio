import { Badge } from "@/components/ui/badge";

const Skills = () => {
  return (
    <div className="mx-auto mt-10">
      <h4 className="text-md md:text-xl font-medium mb-4">Skills</h4>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="text-gray-600 dark:text-neutral-400 text-sm font-mono">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
};

const skills = [
  "Next.js",
  "Node.js",
  "React",
  "TypeScript",
  "JavaScript",
  "Express",
  "PostgreSQL",
  "Docker",
  "HTML5",
  "CSS3",
  "Prisma",
  "Sequelize",
  "MongoDB",
  "MySQL",
  "Vercel",
  "Tailwind CSS",
  "Material-UI",
  "Socket.IO",
  "Git",
  "GitHub",
  "GitLab",
  "Visual Studio Code",
];

export default Skills;