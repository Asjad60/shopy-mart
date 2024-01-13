const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required:true
    },
    quantity: {
      type: Number,
      default: 1,
    },
    orderPrice: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "CANCELLED", "ORDER_PLACED", "DISPATCHED" ,"DELIVERED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const OrderModal = mongoose.model("Order", ordersSchema);
module.exports = OrderModal;
