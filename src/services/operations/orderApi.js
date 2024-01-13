import { orderEndpoints } from "../apis";
import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";

const {CREATE_ORDER_API,CANCEL_ORDER_API,GET_SUPPLIER_ORDERS,CHANGE_ORDER_STATUS_API} = orderEndpoints

export const createOrder = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector(
      "POST",
      CREATE_ORDER_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("response from create Order ==> ", response);

    if (!response?.data.success) {
      throw new Error(response?.data?.message);
    }
    toast.success("Order Submitted");
  } catch (error) {
    console.log("CREATE_ORDER_API ERROR ==> ", error);
    toast.error("Order Failed");
  }

  toast.dismiss(toastId);
};

export const cancelOrder = async (data, token) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector(
        "POST",
        CANCEL_ORDER_API,
        data,
        {
          Authorization: `Bearer ${token}`,
        }
      );
  
      console.log("response from CANCEL_ORDER_API ==> ",response)
  
      if(!response?.data.success){
        throw new Error(response?.data?.message)
      }
      toast.success("Order Cancelled")
  
    } catch (error) {
      console.log("CANCEL_ORDER_API ERROR ==> ",error)
      toast.error("Cancellation Failed")
    }
  
    toast.dismiss(toastId)
  };
  
export const getSupplierOrders = async (token) =>{
  let result  = [];
  const toastId = toast.loading("Loading...")
  try {
    const response  = await apiConnector("GET",GET_SUPPLIER_ORDERS,null,{
      Authorization: `Bearer ${token}`
    })

    if (!response?.data?.success) {
      throw new Error(response?.data?.message)
    }

    result = response?.data?.data

  } catch (error) {
    console.log("CANCEL_ORDER_API ERROR ==> ",error)
      toast.error("Cancellation Failed")
  }

  toast.dismiss(toastId)
  return result
}


export const changeOrderStatus = async (orderId,status,token) => {
  const toastId= toast.loading("Loading...")
  let result = []
   try {
     const response = await apiConnector("POST",CHANGE_ORDER_STATUS_API,
     {status,orderId},
     {
      Authorization: `Bearer ${token}`
     })

     if(!response.data.success){
      throw new Error(response?.data?.message)
     }

     result = response?.data?.data
     toast.success("Order Updated")
   } catch (error) {
    console.log("CANCEL_ORDER_API ERROR ==> ",error)
    toast.error("Changing Status Failed")
   }

   toast.dismiss(toastId)
   return result;
}