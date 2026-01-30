import {
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  GraduationCap,
} from "lucide-react";

import Link from "next/link";

const Footer = () => {
  return (
    <div className="bg-gray-800 py-10 px-12 flex flex-col justify-between md:flex-row">
      <div className="mb-10 md:mb-0">
        <div className="flex gap-1 mb-3">
          <GraduationCap className="text-gray-300 w-10 h-10" />
          <h1 className="text-gray-300 text-3xl font-bold">CMS</h1>
        </div>
        <p className="text-white max-w-lg">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industrys standard dummy text
        </p>
      </div>
      <div className="mb-10 md:mb-0">
        <h4 className="font-bold text-white mb-3">My Information</h4>
        <div className="text-white">Name:- Preetham Poojari</div>
        <div className="text-white">Mobile No:- +91 90760-50054</div>
      </div>
      <div className="mb-10 md:mb-0">
        <h2 className="font-bold text-white mb-3">My Social Media Links</h2>
        <div className="text-white flex gap-3 mt-3">
          <Link href="https://github.com/Preethampoojari" target="_blank">
            <GithubIcon />
          </Link>
          <Link
            href="https://www.linkedin.com/in/preethampoojari/"
            target="_blank"
          >
            <LinkedinIcon />
          </Link>
          <Link href="mailto:preethampoojari146@gmail.com">
            <MailIcon />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
