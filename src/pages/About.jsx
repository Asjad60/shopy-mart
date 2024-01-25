import React from "react";
import HeaderSection from "../components/core/AboutUsPage/HeaderSection";
import firstImg from "../assets/images/aboutImg2.jpg";
import secondImg from "../assets/images/aboutImg.jpg";
import HighlightedText from "../components/common/HighlightedText";
import Footer from "../components/common/Footer";
import { cardTexts } from "../data/aboutTextCards";
import * as Icons from "react-icons/fc";
import ReviewSlider from "../components/common/ReviewSlider";

const About = () => {
  return (
    <div>
      <div className="max-w-maxContent mx-auto mb-40">
        <HeaderSection />

        <div className="text-white flex flex-col items-center gap-y-24 md:flex-row w-full mt-28 justify-between px-4">
          <div className=" md:w-[50%] flex flex-col max-[767px]:items-center">
            <HighlightedText text={"Our Story"} />

            <p className="text-sm text-gray-300 mt-6">
              Founded with a passion for connecting peoplewith the products they
              love, ShopyMart emerged as a hu where exploration meets
              satisfaction. We began the journey with a commitment to redefine
              online shopping and today, we stand proud as a beacon of
              reliability and innovation
            </p>
          </div>
          <div className="flex relative px-4">
            <img
              src={firstImg}
              alt="AboutUs Img"
              className="max-w-[200px] object-cover rounded-md mr-20 max-h-[200px] w-full "
            />
            <img
              src={secondImg}
              alt="AboutUs Img"
              className="max-w-[150px] object-cover rounded-md absolute right-0 top-[-5rem] w-full "
            />
          </div>
        </div>

        <div className="mt-28 text-white w-full mx-auto px-4">
          <HighlightedText text={"What Sets Us Apart"} customClass={"text-center"} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-8 mx-auto justify-items-center">
            {cardTexts.map((ele, i) => {
              const Icon = Icons[ele.icon];
              return (
                <div
                  key={i}
                  className="max-w-[270px] max-h-[250px] bg-[#161d29] flex flex-col gap-4 p-4 rounded-md hover:scale-105 transition-all shadow-sm shadow-sky-400"
                >
                  <Icon size={25} />
                  <p className=" font-medium whitespace-nowrap">{ele.title}</p>
                  <p className="text-[12px] text-gray-300">{ele.des}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============ Review Slider ============== */}
        <div className="relative mx-auto my-28 flex  h-[184px] max-w-maxContentTab lg:max-w-maxContent w-11/12 flex-col items-center justify-between gap-8  text-white">
          <HighlightedText
            text={"Our Happy Customers"}
            customClass={"text-center "}
          />
          <ReviewSlider />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
