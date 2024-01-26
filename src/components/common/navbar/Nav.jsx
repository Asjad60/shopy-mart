import React, { useState } from "react";
import "./Nav.css";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import { NavLinks } from "../../../data/navbar-links";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { AiOutlineMenu } from "react-icons/ai";
import ProfileDropdown from "../../core/profileDropDown/ProfileDropdown";
import { useEffect } from "react";
import { getCategories } from "../../../services/operations/productApi";
import logo from "../../../assets/logo/shopyLogo.png";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { setSearchValue } from "../../../slices/searchProductSlice";
import { IoSearch } from "react-icons/io5";

const Nav = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [subLinks, setSubLinks] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [showSearchbar, setShowSearchbar] = useState(false);
  const [openNavbar, setOpenNavbar] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await getCategories();
      if (result) {
        setSubLinks(result);
      }
    })();

     const handleResize = () => {
      if (window.innerWidth <= 767) {
        setShowSearchbar(true);
      } else {
        setShowSearchbar(false);
      }
    };
   
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };

    // eslint-disable-next-line
  }, []);


  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const handleSeachProduct = (e) => {
    e.preventDefault();

    if (!searchVal) return;
    dispatch(setSearchValue(searchVal));

    navigate("/search");
    setOpenNavbar(false)
  };


  return (
    <>
      <div className="nav py-7">
        <div className="max-w-maxContent w-full flex justify-between">
          <Link to="/" className="overflow-y-hidden h-18 mt-3 object-cover ">
            <img src={logo} alt="logo" className="logo" />
          </Link>
          <div
            className={`navLinks ${
              openNavbar ? "show " : "hide"
            }  items-center justify-end `}
          >
            <nav className={`navbar z-10 `}>
              <ul className="nav-list">
                {NavLinks.map((link, index) => (
                  <li key={index} className="text-lg text-start">
                    {link.title === "Catalog" ? (
                      <>
                        <div
                          className={`catalog-dropDown ${
                            matchRoute("/catalog/:catalogName")
                              ? "active"
                              : "white"
                          }`}
                        >
                          <p className=" cursor-pointer">{link?.title}</p>

                          <MdOutlineKeyboardArrowDown
                            style={{
                              color: "#ffffffd8",
                              fontSize: "23px",
                              transform: "translateY(2px)",
                            }}
                          />

                          <div className={`dropDown-links`}>
                            <div className="triangle"></div>
                            {subLinks.map((sublink, index) => (
                              <Link
                                to={`/catalog/${sublink?.name
                                  .split(" ")
                                  .join("-")
                                  .toLowerCase()}`}
                                key={index}
                                className="catalog-links z-[3000]"
                                onClick={() => setOpenNavbar(false)}
                              >
                                <p> {sublink?.name} </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        to={link?.path}
                        className={`${
                          matchRoute(link?.path) ? "active" : "white"
                        }`}
                        onClick={() => setOpenNavbar(false)}
                      >
                        {link.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Login / Sign-UP / Dashboard */}

            <div
              className={`md:flex flex-col-reverse md:flex-row gap-4 md:gap-1 items-center ${
                openNavbar ? "flex" : "hidden"
              }`}
            >
            <form className="relative flex items-center" onSubmit={handleSeachProduct}>
              <div className={`relative  ${showSearchbar ? "block" : "hidden"}`}>
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search Product"
                  className={`form-style h-9 text-sm  md:absolute top-7 -right-20`}
                />
                <button className="absolute top-2 right-2 md:top-9 md:-right-[75px]  " type="submit">
                  <IoSearch className="text-white" size={20} />
                </button>
              </div>

              <button className="border border-[#2c333f] p-[0.6rem] rounded-md hidden md:block" type="button"
              onClick={()=> setShowSearchbar(prev => !prev)}
              >
                <IoSearch className="text-white" size={20} />
              </button>
            </form>
              {user && user?.accountType !== ACCOUNT_TYPE.SUPPLIER && (
                <Link to="dashboard/cart" className={`cart-icon-link`} onClick={(e)=>e.stopPropagation()}>
                  <AiOutlineShoppingCart className=" text-white text-2xl mr-2" />
                  {totalItems > 0 && (
                    <span className="totalItems-span">{totalItems}</span>
                  )}
                </Link>
              )}

              {token === null && !(location.pathname === "/login") && (
                <Link to="/login">
                  <button className="login-sign-btn" onClick={() => setOpenNavbar(false)}>Log in</button>
                </Link>
              )}

              {token === null && !(location.pathname === "/signup") && (
                <Link to="/signup">
                  <button className="login-sign-btn" onClick={() => setOpenNavbar(false)}>Sign Up</button>
                </Link>
              )}

              {token !== null && <ProfileDropdown setOpenNavbar={setOpenNavbar}/>}
            </div>
          </div>
        </div>
        <button
          className="md:hidden mr-4"
          onClick={() => setOpenNavbar(!openNavbar)}
        >
          <AiOutlineMenu fontSize={26} fill="#AFB2BF" />
        </button>
      </div>
    </>
  );
};

export default Nav;
