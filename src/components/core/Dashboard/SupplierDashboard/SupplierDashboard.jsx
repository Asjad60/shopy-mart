import React, { useEffect, useState } from "react";
import { getSupplierData } from "../../../../services/operations/profileApi";
import { useSelector } from "react-redux";
import { getSupplierProducts } from "../../../../services/operations/productApi";
import SupplierChart from "./SupplierChart";
import { Link } from "react-router-dom";

function SupplierDashboard() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const supplierApiData = await getSupplierData(token);
      const productData = await getSupplierProducts(token);

      if (supplierApiData.length) {
        setSupplierData(supplierApiData);
      }
      if (productData.length) {
        setProducts(productData);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-44px)] w-full grid place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }
  const totalAmount = supplierData?.reduce(
    (acc, curr) => acc + curr.totalPrice,
    0
  );
  const totalBuyers = supplierData?.reduce(
    (acc, curr) => acc + curr.totalBuyers,
    0
  );
  return (
    <div className="text-white mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-medium">
          Hi {user?.name.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-400 text-sm">Lets Start Something new</p>
      </div>

      {products.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-4 max-h-[350px]">
          <SupplierChart products={supplierData}/>

          <div className="max-h-[350px] w-[30%] bg-[#161d29] flex flex-col gap-y-4 p-6 rounded-md">
            <p className="text-lg font-medium">Statistics</p>
            <div>
              <p className="text-gray-400">Total Products</p>
              <p className="text-3xl font-medium">{products.length}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Buyers</p>
              <p className="text-3xl font-medium">{totalBuyers}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Income</p>
              <p className="text-3xl font-medium">Rs. {totalAmount}</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p>You dont have not Listed any product</p>
          <Link to="/dashboard/addProduct">List Your Products</Link>
        </div>
      )}

      <div className="flex justify-between flex-col bg-[#161d29] p-6 rounded-md mt-4">
        <div className="flex justify-between mb-2 ">
          <p>Your Products</p>
          <Link to={"/dashboard/my-listings"}>
            <p className="text-yellow-400 font-medium text-sm">View All</p>
          </Link>
        </div>
        <div className="flex justify-between ">
          {products.slice(0, 3).map((product) => (
            <div key={product._id}>
              <img
                src={product?.thumbnail}
                alt=""
                className="max-w-[200px] rounded-md max-h-[200px] h-full w-full object-cover "
              />
              <p className=" font-medium mt-1">{product?.productName}</p>
              <div className="flex text-[12px] text-gray-400 gap-2">
                <p>{product.buyer.length} Buyers</p>
                <p>|</p>
                <p>Rs {product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SupplierDashboard;
