import React, { useEffect, useState } from "react";
import { getSearchedProducts } from "../services/operations/productApi";
import Product_Card from "../components/core/Catalog/ProductCard";
import { useSelector } from "react-redux";

const SearchProduct = () => {
  const { searchValue } = useSelector((state) => state.search);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await getSearchedProducts(searchValue.toLowerCase());

      if (result) {
        setProducts(result);
      }
      setLoading(false);
    })();
  }, [searchValue]);

  if (loading) {
    return (
      <div className="grid place-items-center h-[calc(100vh-44px)] w-full">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      {products?.length > 0 ? (
        <div className="max-w-maxContent mx-auto grid justify-items-center grid-cols-1 min-[445px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  w-full p-6 text-white gap-4">
          {products.map((product) => (
            <Product_Card product={product} key={product._id} />
          ))}
        </div>
      ) : (
        <div className="min-h-[calc(100vh-44px)] h-full w-full flex justify-center items-center gap-3 text-white">
          <h1 className="text-5xl font-medium">404</h1>
          <p>Not Found</p>
        </div>
      )}
    </>
  );
};

export default SearchProduct;
