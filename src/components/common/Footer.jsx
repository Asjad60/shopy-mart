import React from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import bgImage from "../../assets/images/footerBgImg.jpg";
import logo from "../../assets/logo/shopyLogo.png";
import { policies, footerLinks } from "../../data/footer-links";

function Footer() {
  return (
    <div
      className={`text-white w-full bg-cover bg-no-repeat bg-center mx-auto min-h-[25rem]`}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className=" bg-[rgba(0,0,0,0.6)] min-h-[25rem] mx-auto w-full flex flex-col items-center p-12">
        <div className="w-full flex flex-col sm:flex-row justify-center p-2 gap-6 max-w-maxContent border-b border-b-[#2c333f]">
          <div className="flex justify-between sm:justify-normal max-[445px]:flex-col max-[445px]:items-center sm:flex-col gap-4 sm:w-[50%]">
            <img
              src={logo}
              alt="logo"
              className=" mix-blend-lighten max-h-[3.7rem] max-w-[13rem] w-full  object-cover"
            />

            <div className="flex flex-col gap-y-2">
              <p className="text-lg text-sky-400 ml-2 font-medium">Follow Us</p>
              <div className="flex gap-x-2">
                <Link
                 target="_blank"
                 to={"https://www.facebook.com/mohd.asjad.900?mibextid=ZbWKwL"}
                >
                  <FaFacebookF size={25} />
                </Link>
                <Link
                 target="_blank"
                 to={"https://www.instagram.com/md_asjad60?igsh=c21mdWlkaTRlM3Ri"}
                >
                <FaInstagram size={25} />
                </Link>
                <FaLinkedinIn size={25} />
                <FaTwitter size={25} />
              </div>
            </div>
          </div>

          <div className="w-full flex max-[445px]:flex-col max-[445px]:items-center gap-y-6 justify-between">
            {footerLinks.map((item, index) => (
              <div className="flex flex-col gap-2 w-full" key={index}>
                <div className="flex  text-center justify-center sm:justify-between gap-2 w-full">
                  <p className="text-lg text-sky-400">{item.title}</p>
                </div>
                <div className="flex flex-col items-center sm:items-start gap-2">
                  {item.links.map((link, i) => (
                    <Link
                      to={`/${link.split(" ").join("-").toLowerCase()}`}
                      key={i}
                    >
                      <p className="hover:underline text-sm"> {link}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center md:flex-row md:justify-between gap-2 w-full max-w-maxContent py-8 text-sm">
          <div className="flex gap-x-2 ">
            {policies.map((ele) => (
              <React.Fragment key={ele.id}>
                <Link to={`/${ele.link}`}>{ele.title}</Link>
                {ele.id !== policies.length && <p>|</p>}
              </React.Fragment>
            ))}
          </div>

          <div>Made with ❤️ © 2023 ShopyMart</div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
