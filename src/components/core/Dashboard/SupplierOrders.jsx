import { useEffect, useState } from "react";
import { getSupplierOrders } from "../../../services/operations/orderApi";
import { useSelector } from "react-redux";
import { formateDate } from "../../../utils/dateFormatter";
import IconButton from "../../common/IconButton";
import { changeOrderStatus } from "../../../services/operations/orderApi";

const statusOrder = ["ORDER_PLACED", "DISPATCHED", "DELIVERED"];
const cancelOrPlaceOrder = {
  cancel: "CANCELLED",
  placeOrder: "ORDER_PLACED",
  pending: "PENDING",
  delivered: "DELIVERED",
};

const SupplierOrders = () => {
  const { token } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);

  const fetchSupplierOrders = async () => {
    const res = await getSupplierOrders(token);
    if (res) {
      setOrders(res);
    }
    // console.log("Response  ==> ", res);
  };

  useEffect(() => {
    fetchSupplierOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeStatus = async (orderId, status) => {
    try {
      await changeOrderStatus(orderId, status, token);
      // setOrders((prevOrders) =>
      //   prevOrders.map((order) => (order._id === orderId ? result : order))
      // );
      fetchSupplierOrders();
    } catch (error) {
      console.error("Error changing order status:", error);
    }
  };

  return (
    <div className="text-white w-full">
      <h1 className="text-4xl font-medium mb-20">Orders</h1>
      <div className=" hidden lg:flex justify-between p-4 font-medium text-xl flex-wrap mr-10">
        <p>Order ID</p>
        <p>Product</p>
        <p>Quantity</p>
        <p>Date</p>
        <p>Price</p>
        <p>Size</p>
        <p>Status</p>
      </div>

      <div className="flex flex-col gap-6 w-full text-sm flex-wrap">
        {orders?.length ? (
          orders.map((order, i) => (
            <div
              className="flex flex-col lg:flex-row justify-between border items-center border-[#2c333f] gap-y-3 p-4 rounded-sm w-full"
              key={order._id}
            >
              <div className="flex justify-between w-full ">
                <h2 className="lg:hidden text-gray-400 font-medium">
                  Order ID:
                </h2>
                <p className="lg:w-[105px] overflow-auto">{order._id}</p>
              </div>

              <div className="flex justify-between w-full">
                <h2 className="lg:hidden text-gray-400 font-medium">
                  Product:
                </h2>
                <img
                  src={order?.product?.thumbnail}
                  alt={order?.product?.productName}
                  className="max-w-[80px] min-h-[80px] max-h-[80px] h-full object-cover lg:mx-auto"
                />
                {/* <p>{order?.product?.productName}</p> */}
              </div>

              <div className="flex justify-between lg:justify-center w-full">
                <h2 className="lg:hidden text-gray-400 font-medium">
                  Quantity:
                </h2>
                <p className="mx-1">{order?.quantity}</p>
              </div>

              <div className="flex justify-between w-full">
                <h2 className="lg:hidden text-gray-400 font-medium">Date:</h2>
                <p className=" whitespace-pre-wrap ml-5">
                  {formateDate(order?.createdAt)}
                </p>
              </div>

              <div className="flex justify-between lg:justify-center w-full">
                <h2 className="lg:hidden text-gray-400 font-medium">Price:</h2>
                <p className="mx-1">{order?.orderPrice}</p>
              </div>

              <div className="flex justify-between lg:justify-center w-full">
                <h2 className="lg:hidden text-gray-400 font-medium">Size:</h2>
                <p className="mx-1">
                  {order?.size ? order?.size : "Free Size"}
                </p>
              </div>

              <div className="flex justify-between gap-2 w-full">
                <h2 className="lg:hidden text-gray-400 font-medium">Status:</h2>
                {order?.status !== cancelOrPlaceOrder.pending &&
                order?.status !== cancelOrPlaceOrder.cancel ? (
                  <select
                    name="status"
                    id="status"
                    value={order?.status}
                    className="bg-[#161d29] rounded-sm outline-none h-8 "
                    onChange={(e) =>
                      handleChangeStatus(order._id, e.target.value)
                    }
                    disabled={order?.status === cancelOrPlaceOrder.delivered}
                  >
                    {statusOrder.map((ele, i) => (
                      <option value={ele} key={i}>
                        {ele}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      className="py-2 px-4 bg-[#161d29] rounded-md"
                      onClick={() =>
                        handleChangeStatus(order._id, cancelOrPlaceOrder.cancel)
                      }
                    >
                      Cancel
                    </button>
                    <IconButton
                      text={"Accept"}
                      onclick={() =>
                        handleChangeStatus(
                          order._id,
                          cancelOrPlaceOrder.placeOrder
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>No Orders</div>
        )}
      </div>
    </div>
  );
};

export default SupplierOrders;
