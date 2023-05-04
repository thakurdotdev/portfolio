import { Typography } from "@material-tailwind/react";

const Footer = () => {
  return (
    <footer className="flex w-full absolute bottom-0 items-center justify-center gap-y-6 border-t border-blue-gray-50 py-3 text-center">
      <Typography color="blue-gray" className="font-normal">
        Made with ❤️ by
        <a href="" className="text-blue-gray-500 hover:underline ml-2">
          Pankaj Kumar
        </a>
      </Typography>
    </footer>
  );
};

export default Footer;
