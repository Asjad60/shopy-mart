import { useEffect, useState } from "react";
import { getSupplierOrders } from "../../../services/operations/orderApi";
import { useSelector } from "react-redux";
import { formateDate } from "../../../utils/dateFormatter";
import IconButton from "../../common/IconButton"
import { changeOrderStatus } from "../../../services/operations/orderApi";

const statusOrder = ["ORDER_PLACED","DISPATCHED", "DELIVERED"];
const cancelOrPlaceOrder = {
  cancel:"CANCELLED",
  placeOrder: "ORDER_PLACED",
  pending: "PENDING",
  delivered: "DELIVERED"
}

const SupplierOrders = () => {
  const { token } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);

  const fetchSupplierOrders = async () => {
    const res = await getSupplierOrders(token);
    if (res) {
      setOrders(res);
    }
    console.log("Response  ==> ", res);
  }

  useEffect(() => {
    fetchSupplierOrders()
  }, []);

  const handleChangeStatus = async (orderId, status) => {
    try {
      const result = await changeOrderStatus(orderId, status, token);
  
      // setOrders((prevOrders) =>
      //   prevOrders.map((order) => (order._id === orderId ? result : order))
      // );
      fetchSupplierOrders()
      
    } catch (error) {
      console.error("Error changing order status:", error);
    }
  };
  

  return (
    <div className="text-white w-full">
      <div className="flex justify-between p-4 font-medium text-xl flex-wrap">
        <p>#</p>
        <p>Order ID</p>
        <p>Product</p>
        <p>Quantity</p>
        <p>Date</p>
        <p>Price</p>
        <p>Status</p>
      </div>

      <div className="flex flex-col gap-6 w-full text-sm flex-wrap">
        {orders?.length ? (
          orders.map((order, i) => (
            <div
              className="flex justify-around border items-center gap-14 border-[#2c333f] p-4 rounded-sm w-full"
              key={order._id}
            >
              <div className="flex gap-6 mr-3">
                <p>{i + 1}</p>
                <p>{order._id}</p>
              </div>

              <div className="flex gap-3">
                <img
                  src={order?.product?.thumbnail}
                  alt={order?.product?.productName}
                  className="max-w-[80px] min-h-[80px] max-h-[80px] h-full object-cover"
                />
                {/* <p>{order?.product?.productName}</p> */}
              </div>

              <p className="">{order?.quantity}</p>

              <p className="">{formateDate(order?.createdAt)}</p>

              <p>{order?.orderPrice}</p>

              <div className="flex flex-col gap-2">
                {order?.status !== cancelOrPlaceOrder.pending && order?.status !== cancelOrPlaceOrder.cancel ? (
                  <select
                    name="status"
                    id="status"
                    value={order?.status}
                    className="bg-[#161d29] rounded-sm outline-none h-8 "
                    onChange={(e)=> handleChangeStatus(order._id,e.target.value)}
                    disabled={order?.status === cancelOrPlaceOrder.delivered}
                  >
                    {statusOrder.map((ele, i) => (
                      <option value={ele} key={i}>
                        {ele}
                      </option>
                    ))}
                  </select>
                ): (
                
                <>
                <button className="py-2 px-4 bg-[#161d29] rounded-md"
                onClick={()=> handleChangeStatus(order._id,cancelOrPlaceOrder.cancel)}
                >Cancel</button>
                <IconButton text={"Accept"}
                 onclick={()=> handleChangeStatus(order._id,cancelOrPlaceOrder.placeOrder)}
                />
                </>
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
