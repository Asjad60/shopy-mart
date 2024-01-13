const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    lowercase:true
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  productContent: [
    // productSection
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  brand: {
    type: String,
    required: true,
    lowercase:true
  },
  stock: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  backSideImage: {
    type: String,
    required: true,
  },
  sideImage1: {
    type: String,
  },
  sideImage2: {
    type: String,
  },

  tags: {
    type: [String],
    required: true,
  },
  specifications: {
    type: [String],
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  buyer: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  status: {
    type: String,
    enum: ["Draft", "Published"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const productModel = mongoose.model("Product", ProductSchema);

module.exports = productModel;
