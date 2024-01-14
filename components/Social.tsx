import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

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
    <section className="fixed xl:bottom-40 xl:left-4 2xl:bottom-80 2xl:left-10 hidden lg:flex flex-col gap-3 z-20">
      {Data.map((item, index) => {
        return (
          <TooltipProvider key={index}>
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
          </TooltipProvider>
        );
      })}
    </section>
  );
};

export default Social;
