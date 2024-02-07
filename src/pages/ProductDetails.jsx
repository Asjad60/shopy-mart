import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { getFullProductDetails } from "../services/operations/productApi";
import IconButton from "../components/common/IconButton";
import { addToCart } from "../slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { ACCOUNT_TYPE } from "../utils/constants";
import { toast } from "react-hot-toast";
// import { buyProduct } from "../services/operations/paymentApi";
import { createOrder } from "../services/operations/orderApi";
import { logout } from "../services/operations/authApi";
import RatingStars from "../components/common/RatingStars";
import GetAvgRating from "../utils/avgRating";
import ProductSpecification from "../components/core/ProductDetails/ProuctSpecification";
import Footer from "../components/common/Footer";
import ProductImageSlider from "../components/core/ProductDetails/ProductImageSlider";
import ProductReviews from "../components/core/ProductDetails/ProductReviews";
import AddressForm from "../components/common/AddressForm";
import { setSelectedSize } from "../slices/cartSlice";
import { FaShare } from "react-icons/fa";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = useParams();
  const [productDetails, setProductDetails] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedImg, setSelectedImg] = useState("");
  const [addressModal, setAddressModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { selectedSize } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(productDetails?.ratingAndReviews);
    setAvgReviewCount(count);
  }, [productDetails]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const products = await getFullProductDetails(productId);
        // console.log("productdetails ====> ", products);
        if (products) {
          setProductDetails(products);
        }
        setLoading(false);
      } catch (error) {
        console.log("Can't get Product Details");
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  const { thumbnail, backSideImage, sideImage1, sideImage2 } = productDetails;
  const imgUrls = [thumbnail, backSideImage, sideImage1, sideImage2].filter(
    Boolean
  );

  const handleAddToCart = () => {
    if (!token) {
      setConfirmationModal({
        text1: "You Are Not Logged In",
        text2: "Please Login To Add TO Cart",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(false),
      });
      return;
    }

    if (
      !selectedSize &&
      (productDetails?.category?.name === "Clothing" ||
        productDetails?.category?.name === "Footwear")
    ) {
      toast.error("Please Select Size");
      return;
    }

    if (user.accountType === ACCOUNT_TYPE.SUPPLIER) {
      toast.error("You Are Seller You Can't Buy A Product");
      return;
    }

    dispatch(addToCart(productDetails));
  };

  const handleBuyProduct = async () => {
    if (!token) {
      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to purchase the product.",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
      return;
    }

    if (
      !selectedSize &&
      (productDetails?.category?.name === "Clothing" ||
        productDetails?.category?.name === "Footwear")
    ) {
      toast.error("Please Select Size");
      return;
    }

    if (user.accountType === ACCOUNT_TYPE.VISITOR) {
      setAddressModal({
        btn1Text: "Cancel",
        btn2Text: "Buy",
        btn1Handler: () => setAddressModal(false),
        btn2Handler: async (addressData) => await buyProduct(addressData),
      });
      return;
    }

    setConfirmationModal({
      text1: "You are a Seller!",
      text2: "You Cant Buy a Product.",
      btn1Text: "Logout",
      btn2Text: "Cancel",
      btn1Handler: () => dispatch(logout(navigate)),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  const buyProduct = async (addressData) => {
    const { address, city, pincode, state, country } = addressData;
    let sizeData;
    if (
      productDetails.category.name === "Clothing" ||
      productDetails.category.name === "Footwear"
    ) {
      sizeData = [{ productId: productId, quantity: 1, size: selectedSize }];
    } else {
      sizeData = [{ productId: productId, quantity: 1 }];
    }
    const orderData = {
      orderItems: sizeData,
      address: `${address}, ${city}, ${pincode},${state}, ${country}`,
    };
    try {
      await createOrder(orderData, token);
    } catch (error) {
      console.log("Error on createOrder Product", error);
    }

    setAddressModal(false);
  };

  const handleWhatsAppShare = (e) => {
    e.preventDefault();
    const encodedLink = encodeURIComponent(window.location);
    const whatsappUrl = `https://wa.me/?text=${encodedLink}`;
    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-57px)] grid place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      {/* <div className="min-h-[150vh]"> */}
      <div className=" max-w-maxContent mx-auto w-full lg:gap-x-10 flex flex-col lg:flex-row p-1 sm:p-6 border-b border-b-[#2c333f]">
        {/* ================= Image Section ================ */}
        <div className="w-full flex flex-col gap-y-4 fixed bottom-0 left-0 lg:sticky lg:top-[60px] max-h-[440px]">
          <div className={`flex gap-x-4 justify-around`}>
            <div className="hidden lg:flex flex-col gap-y-2 ">
              {imgUrls.map((image, i) => (
                <img
                  src={image}
                  key={i}
                  alt={productDetails?.productName}
                  className={`max-h-[80px] max-w-[80px] object-cover aspect-square cursor-pointer ${
                    selectedImg === image && "border-2 border-blue-500"
                  }`}
                  onMouseOver={() => setSelectedImg(image)}
                />
              ))}
            </div>

            <div className="flex flex-col gap-4  max-[1023px]:w-full mx-auto">
              <div className="max-w-[350px] max-h-[350px] bg-white">
                <img
                  src={selectedImg || imgUrls?.[0]}
                  alt={productDetails?.productName}
                  className=" max-w-[350px] max-h-[350px] object-contain aspect-square hidden lg:block"
                />
              </div>
              <div className="flex justify-around gap-4 p-5  max-[1023px]:bg-[#161d29a9] max-[1023px]:w-full">
                <button
                  className="rounded-md bg-[#2C333F] text-white p-2"
                  onClick={handleAddToCart}
                  disabled={
                    productDetails?.stock === 0 ||
                    productDetails?.sizes?.some((ele) => ele.stock === 0)
                  }
                >
                  {productDetails?.stock > 0 ||
                  productDetails?.sizes?.some((ele) => ele.stock > 0)
                    ? "ADD TO CART"
                    : "NOTIFY ME"}
                </button>
                <IconButton
                  text={
                    productDetails?.stock > 0 ||
                    productDetails?.sizes?.some((ele) => ele.stock > 0)
                      ? "BUY NOW"
                      : "COMING SOON"
                  }
                  onclick={handleBuyProduct}
                  disabled={
                    productDetails?.stock === 0 ||
                    productDetails?.sizes?.some((ele) => ele.stock === 0)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============ For Mobile Screen Image Slider And Buttons */}
        <div className="flex lg:hidden mb-3 z-0">
          <ProductImageSlider images={imgUrls} />
        </div>
        {/* =====================XXXXXXXXXXXXXXXXXX===================== */}

        {/* =============== Product Details Section ==================*/}
        <div className="mx-auto text-white flex flex-col gap-4 max-w-[700px] w-full">
          <div className="flex justify-between w-full">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link to="/" className="hover:text-yellow-400">
                Home
              </Link>
              <p className="text-xl">›</p>
              <p className="capitalize">
                {location.pathname?.split("/").at(-2)}
              </p>
              <p className="text-xl">›</p>
              <p className="uppercase text-[12px]">
                {productDetails?.productName?.split(" ").slice(0, 4).join(" ")}
              </p>
            </div>
            <button
              className="flex items-center gap-2 text-gray-400 hover:text-yellow-400"
              onClick={handleWhatsAppShare}
            >
              <FaShare size={17} /> <p>Share</p>
            </button>
          </div>
          <div className="flex flex-col ">
            <p className="text-2xl uppercase">{productDetails?.productName}</p>
            <div className="flex gap-x-2 text-sm">
              <p>{avgReviewCount.toString()}</p>
              <RatingStars Review_Count={avgReviewCount} Star_Size={17} />
              <p>{productDetails?.ratingAndReviews?.length} Ratings</p>
            </div>
          </div>

          <div className="flex mb-16">
            <p className="text-3xl">₹{productDetails?.price}</p>
          </div>

          <div className="flex gap-x-16 mt-2">
            <h2 className="font-medium text-gray-400">Highlights</h2>
            <div className="capitalize">
              {productDetails?.specifications?.map((data, i) => (
                <div className="flex items-center gap-4 text-sm" key={i}>
                  <p className="h-[6px] w-[6px] rounded-full bg-gray-500 mb-2"></p>
                  <p className="mb-2">{data}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-x-20 mb-2">
            <h2 className="font-medium text-gray-400">Brand</h2>
            <p className={`uppercase`}>{productDetails?.brand}</p>
          </div>

          <div className="flex gap-[70px] mb-2">
            <h2 className="font-medium text-gray-400">Colour</h2>
            <p
              className={`w-[30px] h-[30px] rounded-full border border-[#2c333f]`}
              style={{ background: `${productDetails?.color}` }}
              title={productDetails?.color?.toUpperCase()}
            ></p>
          </div>

          {productDetails?.sizes?.length > 0 && (
            <div className="flex gap-x-20 mb-2">
              <h2 className="font-medium text-gray-400">Sizes</h2>
              <div className="flex gap-3 flex-wrap">
                {productDetails?.sizes.map((size, i) => (
                  <button
                    type="button"
                    className={`uppercase ${
                      size.stock === 0 && "opacity-50"
                    } py-0.5 px-4 bg-[#2c333f] rounded-3xl cursor-pointer hover:border border-sky-400 ${
                      selectedSize === size.size && "border border-sky-400"
                    } box-content`}
                    key={i}
                    onClick={() => dispatch(setSelectedSize(size.size))}
                    disabled={size.stock === 0}
                  >
                    {size.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-x-20 ">
            <p className="text-gray-400 font-medium ">Seller</p>
            <div className="flex gap-x-4 items-center">
              <img
                src={
                  productDetails?.supplier?.image
                    ? productDetails?.supplier?.image
                    : `https://api.dicebear.com/5.x/initials/svg?seed=${productDetails?.supplier?.name}`
                }
                alt="SellerImg"
                className="object-cover max-w-[30px] rounded-full"
              />
              <p>{productDetails?.supplier?.name}</p>
            </div>
          </div>

          <div className="flex flex-col my-4">
            <p className=" text-gray-400 font-medium">Description :</p>
            <p className="text-sm text-gray-500">
              {productDetails?.productDescription}
            </p>
          </div>

          <ProductSpecification product={productDetails} />

          {/* Rating And Reviews */}
          <ProductReviews
            ratingAndReviews={productDetails?.ratingAndReviews}
            productId={productId}
          />
        </div>
      </div>
      {/* </div> */}
      <Footer />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
      {addressModal && <AddressForm modalData={addressModal} />}
    </>
  );
};

export default ProductDetails;
