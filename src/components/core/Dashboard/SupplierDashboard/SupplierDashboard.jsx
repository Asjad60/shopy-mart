import React, { useEffect, useState } from "react";
import { getSupplierData } from "../../../../services/operations/profileApi";
import { useSelector } from "react-redux";
// import { getSupplierProducts } from "../../../../services/operations/productApi";
import SupplierChart from "./SupplierChart";
import { Link } from "react-router-dom";

function SupplierDashboard() {
  const [loading, setLoading] = useState(false);
  const [supplierData, setSupplierData] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const supplierApiData = await getSupplierData(token);

      if (supplierApiData.length) {
        setSupplierData(supplierApiData);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line 
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
    <>
      <div className="text-white mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-medium">
            Hi {user?.name.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-400 text-sm">Lets Start Something new</p>
        </div>

        {supplierData.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-6 max-h-[350px] mb-2">
            <SupplierChart products={supplierData} />

            <div className="min-h-[350px] w-full lg:w-[40%] bg-[#161d29] flex flex-col gap-y-4 p-6 rounded-md">
              <p className="text-lg font-medium">Statistics</p>
              <div>
                <p className="text-gray-400">Total Products</p>
                <p className="text-3xl font-medium">{supplierData.length}</p>
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
      </div>
    </>
  );
}

export default SupplierDashboard;
