import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiConnector } from "../services/apiconnector";
import { categoryEndpoints } from "../services/apis";
import { getCatalogPageData } from "../services/operations/pageAndComponentData";
import ProductSlider from "../components/core/Catalog/ProductSlider";
import ProductCard from "../components/core/Catalog/ProductCard";
import Footer from "../components/common/Footer";
import HighlightedText from "../components/common/HighlightedText";
import FilterProductsSidebar from "../components/core/Catalog/FilterProductsSidebar";

function Catalog() {
  const { catalogName } = useParams();
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [active, setActive] = useState(1);
  const [categoryId, setCategoryId] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [minAndMaxPrice, setMinAndMaxPrice] = useState({
    min: 0,
    max: 0,
  });
  const [pages, setPages] = useState({
    page: 1,
    pageSize: 8,
  });

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await apiConnector(
          "GET",
          categoryEndpoints.GET_CATEGORIES_API
        );
        const category_id = res?.data?.data.filter(
          (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
        )[0]._id;
        setCategoryId(category_id);
      } catch (error) {
        console.log("getCategories", error);
      }
    };
    getCategories();
  }, [catalogName]);

  useEffect(() => {
    const getCategoryDetails = async () => {
      try {
        const response = await getCatalogPageData(
          categoryId,
          pages.page,
          pages.pageSize
        );
        // console.log("getCategoryDetails ===> ", response);
        setCatalogPageData(response);

        // sortingProducts(1, response);
      } catch (error) {
        console.log("getCategoryDetails", error);
      }
    };
    if (categoryId) {
      getCategoryDetails();
    }
    // eslint-disable-next-line
  }, [categoryId, pages.page, pages.pageSize]);

  useEffect(() => {
    if (!catalogPageData) {
      return;
    }

    const sortedProducts = [
      ...catalogPageData.data?.selectedCategory?.products,
    ];

    switch (active) {
      case 1:
        sortedProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case 2:
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 3:
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setCatalogPageData((prevData) => ({
      ...prevData,
      data: {
        ...prevData?.data,
        selectedCategory: {
          ...prevData?.data?.selectedCategory,
          products: sortedProducts,
        },
      },
    }));
    //
  }, [active, catalogPageData]);

  if (!catalogPageData || !categoryId) {
    return (
      <div className="grid place-items-center min-h-screen min-w-full">
        <div className="spinner"></div>
      </div>
    );
  }

  const filteredProducts =
    catalogPageData?.data?.selectedCategory?.products.filter(
      (product) =>
        (selectedFilters.length === 0 ||
          selectedFilters.includes(product.brand)) &&
        (minAndMaxPrice.min === "" ||
          product.price >= parseInt(minAndMaxPrice.min)) &&
        (minAndMaxPrice.max === "" ||
          product.price <= parseInt(minAndMaxPrice.max))
    );

  const totalPages = Math.ceil(catalogPageData?.total / pages.pageSize) || 1;

  return (
    <div className="text-white flex relative">
      <FilterProductsSidebar
        products={catalogPageData?.data?.selectedCategory?.products}
        brands={catalogPageData?.data?.brands}
        setSelectedFilters={setSelectedFilters}
        selectedFilters={selectedFilters}
        minAndMaxPrice={minAndMaxPrice}
        setMinAndMaxPrice={setMinAndMaxPrice}
      />
      <div className="h-[calc(100vh-57px)] flex-1 overflow-auto">
        <div className=" mx-auto bg-[#161d29] min-h-[240px] rounded-ee-md w-full">
          <div className="mx-auto  px-4 py-20 w-full max-w-maxContentTab lg:max-w-maxContent">
            <p className="text-slate-400 text-sm mb-4">
              Home / Catalog /{" "}
              <span className="text-yellow-400 capitalize">
                {catalogName.split("-").join(" ")}
              </span>
            </p>
            <p className="text-3xl font-medium capitalize">
              {" "}
              {catalogName.split("-").join(" ")}
            </p>
          </div>
        </div>

        <div>
          {/* section 1  */}
          <div className=" mx-auto  px-4 py-12 w-full max-w-maxContentTab lg:max-w-maxContent">
            <div className="text-3xl font-medium md:text-4xl mb-4">
              <HighlightedText text={"Products to get you Started"} />
            </div>
            <div className="flex gap-x-5 border-b border-b-[#2C333F] cursor-pointer">
              <p
                className={`py-2 ${
                  active === 1
                    ? "border-b border-b-yellow-400 text-yellow-400"
                    : ""
                }`}
                onClick={(e) => setActive(1)}
              >
                Newest First
              </p>
              <p
                className={`py-2 ${
                  active === 2
                    ? "border-b border-b-yellow-400 text-yellow-400"
                    : ""
                }`}
                onClick={(e) => setActive(2)}
              >
                Price -- Low to High
              </p>
              <p
                className={`py-2 ${
                  active === 3
                    ? "border-b border-b-yellow-400 text-yellow-400"
                    : ""
                }`}
                onClick={(e) => setActive(3)}
              >
                Price -- High to Low
              </p>
            </div>
            <div className="py-4">
              <div className="grid max-[445px]:place-items-center grid-cols-1 min-[445px]:grid-cols-2 min-[865px]:grid-cols-3 min-[1095px]:grid-cols-4 gap-y-5">
                {filteredProducts?.length > 0 ? (
                  filteredProducts?.map((product, index) => (
                    <ProductCard product={product} key={index} />
                  ))
                ) : (
                  <h2 className="text-2xl font-medium text-yellow-400">
                    Not Found
                  </h2>
                )}
              </div>
            </div>

            {/* pagination */}
            <div className="border border-[#2c333f] py-6 px-3 flex flex-col sm:flex-row justify-between gap-3 items-center mt-10">
              <span className="whitespace-nowrap">
                Page {pages.page} of {totalPages}
              </span>

              <div className="flex justify-center sm:justify-between w-2/4 text-sm">
                {pages.page > 1 && (
                  <button
                    onClick={() => {
                      setPages((prevPages) => ({
                        ...prevPages,
                        page: prevPages.page - 1,
                      }));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-yellow-400"
                  >
                    PREVIOUS
                  </button>
                )}
                <div className=" overflow-hidden max-w-[400px]">
                  {Array(totalPages)
                    .fill(null)
                    .map((_, i) => (
                      <button
                        key={i}
                        className={`rounded-full px-2 ${
                          pages.page === i + 1 && "bg-yellow-400 text-black"
                        }`}
                        onClick={() => {
                          setPages((prevPages) => ({
                            ...prevPages,
                            page: i + 1,
                          }));
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                </div>
                {pages.page < totalPages && (
                  <button
                    onClick={() => {
                      setPages((prevPages) => ({
                        ...prevPages,
                        page: prevPages.page + 1,
                      }));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-yellow-400"
                  >
                    NEXT
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* section2 */}
          <div className=" mx-auto  px-4 py-12 w-full max-w-maxContentTab lg:max-w-maxContent">
            <HighlightedText
              text={`Top Products in ${catalogPageData?.data?.differentCategory?.name}`}
            />
            <div className="py-8 border-t border-[#2C333F] w-full mt-4">
              <ProductSlider
                products={catalogPageData?.data?.differentCategory?.products}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Catalog;
