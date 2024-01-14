import React, { useEffect, useState } from "react";
import { apiConnector } from "../services/apiconnector";
import { allProductData } from "../services/apis";
import PopularProducts from "../components/core/HomePage/PopularProducts";
import Footer from "../components/common/Footer";
import ImageSectionSlider from "../components/core/HomePage/ImageSectionSlider";
import { useNavigate } from "react-router-dom";
import IconButton from "../components/common/IconButton";
import LatestProducts from "../components/core/HomePage/LatestProducts";
import AboutDelivery from "../components/core/HomePage/AboutDelivery";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    async function getProductData() {
      try {
        setLoading(true);
        const response = await apiConnector(
          "GET",
          allProductData.GET_PRODUCT_API
        );
        if (response) {
          setProducts(response?.data?.data);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    getProductData();
  }, []);

  let randomTwoProducts;
  if (products && products?.latestProducts) {
    const randomIdx1 = Math.floor(
      Math.random() * products?.latestProducts?.length
    );
    const randomIdx2 = Math.floor(
      Math.random() * products?.latestProducts?.length
    );

    randomTwoProducts = products?.latestProducts
      .slice(randomIdx1, randomIdx1 + 1)
      .concat(products?.latestProducts.slice(randomIdx2, randomIdx2 + 1));
  }

  if (loading) {
    return (
      <div className="grid place-items-center min-h-[calc(100vh-3.6rem)] w-full">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <ImageSectionSlider products={products?.randomProducts} />
      <div className=" w-full max-w-maxContentTab lg:max-w-maxContent mx-auto mt-20 p-4">
        <div className="  w-full flex flex-col sm:flex-row justify-center items-center gap-6 lg:gap-20  mb-20">
          {products?.latestProducts?.length  &&
            randomTwoProducts.map((ele, i) => (
              <div
                className="border border-[#2c333f] text-white rounded-sm w-full max-w-[500px]  h-full max-h-[500px]  p-4 flex flex-col items-center gap-4"
                key={i}
              >
                <p>{ele.productName}</p>
                <h1 className="text-2xl font-medium min-[350px]:whitespace-nowrap">
                  Just Starting At <span className=" text-lg">₹</span>
                  {ele.price}
                </h1>
                <IconButton
                  text={"Shop Now"}
                  onclick={() => navigate(`/products/${ele._id}`)}
                  customClasses={" whitespace-nowrap"}
                />
                <img
                  src={ele?.thumbnail}
                  alt=""
                  className=" max-w-[280px] w-full min-h-[280px] h-full max-[340px]:min-h-[200px] object-cover"
                />
              </div>
            ))}
        </div>

        <LatestProducts products={ products?.latestProducts} />

        <PopularProducts products={products?.popularProducts} />
      </div>
      <AboutDelivery />
      <Footer />
    </>
  );
}

export default Home;
