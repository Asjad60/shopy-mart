const mongoose = require("mongoose");

const RegisterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["Admin", "Visitor", "Supplier"],
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  token: {
    type: String,
  },
  image: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});
let UserModel = mongoose.model("User", RegisterSchema);

module.exports = UserModel;
