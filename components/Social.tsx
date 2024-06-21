import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NextImage from "./NextImage";

export default function Social() {
  return (
    <section className="md:fixed xl:bottom-40 xl:left-4 2xl:bottom-80 2xl:left-10 hidden lg:flex lg:flex-col gap-3 z-20">
      {Data.map((item, index) => {
        return (
          <TooltipProvider key={index}>
            <Link href={item.link} passHref={true} target="_blank">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full">
                    <NextImage
                      src={item.icon}
                      alt={item.tooltip}
                      width={24}
                      height={24}
                      className={"fill-current text-gray-800"}
                    />
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
}

export const PhoneSocial = () => {
  return (
    <div className="flex flex-row justify-center space-x-5 mt-2 sm:hidden">
      {Data.map((item, index) => {
        return (
          <TooltipProvider key={index}>
            <Link href={item.link} passHref={true} target="_blank">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full">
                    <NextImage
                      src={item.icon}
                      alt={item.tooltip}
                      width={24}
                      height={24}
                      className={"fill-current text-gray-800"}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{item.tooltip}</TooltipContent>
              </Tooltip>
            </Link>
          </TooltipProvider>
        );
      })}
    </div>
  );
};

export const Data = [
  {
    link: "https://www.linkedin.com/in/thakurdotdev",
    icon: "https://www.svgrepo.com/show/475661/linkedin-color.svg",
    tooltip: "Connect On Linkedin",
  },
  {
    link: "https://github.com/thakurdotdev",
    icon: "https://www.svgrepo.com/show/475654/github-color.svg",
    tooltip: "Connect On Github",
  },
  {
    link: "https://twitter.com/thakurdotdev",
    icon: "https://www.svgrepo.com/show/475689/twitter-color.svg",
    tooltip: "Follow On X",
  },
  {
    link: "mailto:thakurdotdev@gmail.com",
    icon: "https://www.svgrepo.com/show/19352/email.svg",
    tooltip: "Mail Us",
  },
];
