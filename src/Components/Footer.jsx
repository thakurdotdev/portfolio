import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="flex w-full mt-auto items-center justify-center border-t border-blue-gray-50 py-3 text-center ">
      <Typography color="blue-gray" className="font-normal">
        Made with ❤️ by
        <Link to={"/"} className="text-blue-gray-500 hover:underline ml-2">
          Pankaj Kumar
        </Link>
      </Typography>
    </footer>
  );
};

export default Footer;
