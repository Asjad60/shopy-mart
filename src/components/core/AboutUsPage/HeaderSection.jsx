import React from "react";
import bgImage from "../../../assets/images/bgAboutPage.jpg"
import IconButton from "../../common/IconButton";
import { useNavigate } from "react-router-dom";

function HeaderSection() {
    const navigate = useNavigate()
  return (
    <div className={`relative w-full max-h-[30rem]`} 
    >
      <img src={bgImage} alt="Products" 
        className='w-full max-h-[30rem] object-center '
        />
      <div className="text-black bg-[rgba(255,255,255,0.5)] flex flex-col gap-2 backdrop-blur-[5px] absolute max-w-[250px] md:max-w-[350px] w-full rounded-md top-10 md:top-28 left-5 md:left-20 p-4">
        <h1 className=" text-xl md:text-3xl">Dive into Innovation</h1>
        <p className=" text-xl md:text-3xl font-medium">
          Discover Our Diverse Range of Products
        </p>
        <p className="text-sm text-gray-700">
          Unleash innovation with our diverse product collection - Electronics,
          Fashion and more.
        </p>

        <IconButton text={"Buy Now"} onclick={()=> navigate("/")} customClasses={"mt-2 self-start"}/>
      </div>
    </div>
  );
}

export default HeaderSection;
