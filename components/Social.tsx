import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

const Data = [
  {
    link: "https://www.linkedin.com/in/pankajktech/",
    icon: Linkedin,
    tooltip: "Connect On Linkedin",
  },
  {
    link: "https://github.com/pankajktech",
    icon: Github,
    tooltip: "Connect On Github",
  },
  {
    link: "https://twitter.com/pankajktech1",
    icon: Twitter,
    tooltip: "Follow On X",
  },
  {
    link: "mailto:mailto:tunewithpk@gmail.com",
    icon: Mail,
    tooltip: "Mail Us",
  },
];

const Social = () => {
  return (
    <section className="md:fixed xl:bottom-40 xl:left-4 2xl:bottom-80 2xl:left-10 flex-row lg:flex-col gap-3 z-20 flex justify-center">
      {Data.map((item, index) => {
        return (
          <TooltipProvider key={index}>
            <Link href={item.link} passHref={true} target="_blank">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
                    <item.icon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{item.tooltip}</TooltipContent>
              </Tooltip>
            </Link>
          </TooltipProvider>
        );
      })}
    </section>
  );
};

export default Social;
