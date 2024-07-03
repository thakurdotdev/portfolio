import IconCloud from "@/components/ui/icons-cloud";

const Skills = () => {
  return (
      <div className="flex justify-center">
      <IconCloud iconSlugs={slugs} />
    </div>
  );
};

const slugs = [
  "typescript",
  "javascript",
  "react",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "sequelize",
  "postgresql",
  "mongodb",
  "mysql",
  "vercel",
  "docker",
  "tailwindcss",
  "materialui",
  "socketdotio",
  "git",
  "github",
  "gitlab",
  "visualstudiocode",
];

export default Skills;
