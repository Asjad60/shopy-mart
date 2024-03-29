const OrderModel = require("../model/Orders");
const ProductModel = require("../model/Product");
const UserModel = require("../model/User");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderItems, address, status = "PENDING" } = req.body;

    if (!orderItems || !address) {
      return res.status(404).json({
        success: false,
        message: "All Fields are required",
      });
    }

    for (const orderItem of orderItems) {
      try {
        await UserModel.findByIdAndUpdate(
          userId,
          {
            $push: { products: orderItem.productId },
          },
          { new: true }
        );

        let updatedProduct;
        if (orderItem.size) {
          console.log("orderItem.size section");
          updatedProduct = await ProductModel.findByIdAndUpdate(
            orderItem.productId,
            {
              $push: { buyer: userId },
              $inc: {
                "sizes.$[elem].stock": orderItem.size ? -orderItem.quantity : 0,
              },
            },
            {
              new: true,
              arrayFilters: [{ "elem.size": orderItem.size }],
            }
          );
        } else {
          console.log("else section");
          updatedProduct = await ProductModel.findByIdAndUpdate(
            orderItem.productId,
            {
              $push: { buyer: userId },
              $inc: { stock: -orderItem.quantity },
            },
            {
              new: true,
            }
          );
        }

        const createOrder = await OrderModel.create({
          customer: userId,
          product: orderItem.productId,
          quantity: orderItem.quantity,
          orderPrice: updatedProduct.price * orderItem.quantity,
          size: orderItem.size,
          status,
          address,
        });

        const supplierId = updatedProduct.supplier;
        await UserModel.findByIdAndUpdate(
          supplierId,
          {
            $push: { orders: createOrder._id },
          },
          { new: true }
        );
      } catch (error) {
        console.log("error occured while creating order ", error);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      // order: createOrder,
    });
  } catch (error) {
    console.log("Error at create order", error);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong to Create Order",
    });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId, productId } = req.body;
    const userId = req.user.id;

    if (!orderId || !productId) {
      return res.status(404).json({
        success: false,
        message: "OrderId And ProductId is required",
      });
    }

    const existingOrder = await OrderModel.findById(orderId);

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await Promise.all([
      UserModel.findByIdAndUpdate(
        userId,
        {
          $pull: { products: productId },
        },
        { new: true }
      ),
      UserModel.findOneAndUpdate(
        { orders: orderId },
        {
          $pull: { orders: orderId },
        },
        { new: true }
      ),
      OrderModel.findByIdAndDelete(orderId),
    ]);

    if (existingOrder.size) {
      await ProductModel.findByIdAndUpdate(
        productId,
        {
          $pull: { buyer: userId },
          $inc: {
            "sizes.$[elem].stock": existingOrder.size
              ? existingOrder.quantity
              : 0,
          },
        },
        { new: true, arrayFilters: [{ "elem.size": existingOrder.size }] }
      );
    } else {
      await ProductModel.findByIdAndUpdate(
        productId,
        {
          $pull: { buyer: userId },
          $inc: { stock: existingOrder.quantity },
        },
        { new: true }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Order Cancelled",
    });
  } catch (error) {
    console.log("Error at Cancel Order", error);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong to Cancel Order",
    });
  }
};

exports.changeOrderStatus = async (req, res) => {
  try {
    const { status, orderId } = req.body;
    const supplierId = req.user.id;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Order Status",
      });
    }

    const updatedStatus = await OrderModel.findByIdAndUpdate(
      orderId,
      {
        $set: { status: status },
      },
      { new: true }
    );

    if (status === "CANCELLED") {
      await Promise.all([
        UserModel.findByIdAndUpdate(
          supplierId,
          {
            $pull: { orders: orderId },
          },
          { new: true }
        ).catch((error) => {
          console.error("Error removing order from supplier:", error);
        }),

        UserModel.findByIdAndUpdate(
          updatedStatus.customer,
          {
            $pull: { products: updatedStatus.product },
          },
          { new: true }
        ).catch((error) => {
          console.error("Error removing product from customer:", error);
        }),
      ]);

      if (updatedStatus.size) {
        await ProductModel.findByIdAndUpdate(
          updatedStatus.product,
          {
            $pull: { buyer: updatedStatus.customer },
            $inc: {
              "sizes.$[elem].stock": updatedStatus.size
                ? updatedStatus.quantity
                : 0,
            },
          },
          { new: true, arrayFilters: [{ "elem.size": updatedStatus.size }] }
        );
      } else {
        await ProductModel.findByIdAndUpdate(
          updatedStatus.product,
          {
            $pull: { buyer: updatedStatus.customer },
            $inc: {stock:  updatedStatus.quantity },
          },
          { new: true }
        );
      }
    }

    return res.status(200).json({
      success: true,
      data: updatedStatus,
      message: "Status Updated",
    });
  } catch (error) {
    console.log("Error at Changing Status Order", error);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong to Changing Status Order",
    });
  }
};
