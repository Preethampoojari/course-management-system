import { Search } from "lucide-react";
import HeroImg from "../public/course-management-systems.jpg";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="bg-slate-800 pt-14">
      <div className="lg:h-175 max-w-7xl mx-auto flex md:flex-row flex-col gap-14 items-center">
        <div className="space-y-7 px-4 md:px-0">
          <h1 className="text-4xl mt-10 md:mt-0 md:text-6xl font-extrabold text-gray-200">
            Explore Our Online <br />
            Courses for all
          </h1>
          <p className="text-gray-300 text-lg">
            A centralized system to manage courses, lessons, and learners
            efficiently.
          </p>
          <div className="inline-flex relative">
            <input
              type="text"
              placeholder="Search Your Course Here..."
              className="bg-gray-200 w-87.5 text-gray-800 p-4 pr-40 rounded-lg rounded-r-xl placeholder:text-gray-500"
            />
            <button className="px-4 py-3.5 flex gap-1 items-center bg-blue-500 font-semibold absolute right-0 text-white rounded-r-lg text-xl">
              Search <Search width={20} height={20}></Search>
            </button>
          </div>
        </div>

        <div className="flex md:h-80 items-end relative px-4 md:px-0">
          <Image
            src={HeroImg}
            alt="Hero Image"
            width={650}
            height={800}
            className="shadow-blue-500 drop-shadow-lg"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
