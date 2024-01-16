const ProductModel = require("../model/Product");
const UserModel = require("../model/User");
const CategoriesModel = require("../model/Category");
const Section = require("../model/Section");
const SubSection = require("../model/SubSection");
const { uploadFileToCloudinary } = require("../utils/imageUploader");
const mongoose = require("mongoose");
const RatingAndReview = require("../model/RatingAndReview");

exports.ImageUpload = async (req, res) => {
  try {
    const file = req.files.file;
    const path =
      __dirname + "/files/" + Date.now() + `.${file.name.split(".")[1]}`;
    console.log(path);

    file.mv(path, (err) => {
      console.log(err);
    });

    res.status(200).json({ message: "Product Adding Successful" });
  } catch (error) {
    res.status(500).json({ message: "Product Adding Issue", error });
  }
};

//<==========================AddProduct Handler===================================>

exports.addProducts = async (req, res) => {
  try {
    const {
      productName,
      price,
      tags: _tag,
      category,
      specifications: _specifications,
      productDescription,
      brand,
      stock,
      color,
      status,
    } = req.body;

    const tags = JSON.parse(_tag);
    const specifications = JSON.parse(_specifications);

    if (
      !productName ||
      !price ||
      !category ||
      !specifications.length ||
      !productDescription ||
      !tags.length ||
      !brand ||
      !stock ||
      !color
    ) {
      return res.status(400).json({
        success: false,
        message: "Fill The Details",
      });
    }

    if (!status || status == undefined) {
      status = "Draft";
    }

    const file = req.files.thumbnail;
    const backImage = req.files.backSideImage;
    const sideImage1 = req.files.sideImage1;
    const sideImage2 = req.files.sideImage2;

    const userId = req.user.id;

    const supplierDetails = await UserModel.findById(userId, {
      accountType: "Supplier",
    });
    if (!supplierDetails) {
      return res.status(404).json({
        success: false,
        message: "supplierDetails Details Not Found",
      });
    }

    const categoryDetails = await CategoriesModel.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }

    const uploadImages = async (files) => {
      const uploadFiles = files.filter((file) => file);
      const uploads = await Promise.all(
        uploadFiles.map((file) => {
          if (file) {
            return uploadFileToCloudinary(file, process.env.FOLDER_NAME);
          }
        })
      );
      return uploads.map((upload) => upload.secure_url);
    };

    const [
      uploadedThumbnail,
      uploadedBackImage,
      uploadedSideImage1,
      uploadedSideImage2,
    ] = await uploadImages([file, backImage, sideImage1, sideImage2]);

    const newProducts = new ProductModel({
      productName,
      price,
      tags,
      category: categoryDetails._id,
      supplier: supplierDetails,
      specifications,
      productDescription,
      brand,
      stock,
      color,
      status,
      thumbnail: uploadedThumbnail,
      backSideImage: uploadedBackImage,
      sideImage1: uploadedSideImage1,
      sideImage2: uploadedSideImage2,
    });

    await Promise.all([
      newProducts.save(),

      UserModel.findByIdAndUpdate(
        {
          _id: supplierDetails._id,
        },
        {
          $push: {
            products: newProducts._id,
          },
        },
        { new: true }
      ),

      CategoriesModel.findByIdAndUpdate(
        { _id: category },
        {
          $push: {
            products: newProducts._id,
          },
        },
        { new: true }
      ),
    ]);

    res.status(200).json({
      success: true,
      data: newProducts,
      message: " Product Created Successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: " Product Adding Error",
    });
  }
};

// ======================= Get All products ======================

exports.getAllProducts = async (req, res) => {
  const sliceToProduct = 8;
  try {
    const allProducts = await ProductModel.find({ status: "Published" })
      .populate("supplier")
      .select("-password")
      .populate("category")
      .populate("ratingAndReviews")
      .exec();

    const latestProducts = allProducts
      .sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
      .slice(0, sliceToProduct);

    let shuffledProducts = [...allProducts];
    for (let i = allProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledProducts[i], shuffledProducts[j]] = [
        shuffledProducts[j],
        shuffledProducts[i],
      ];
    }
    const randomProducts = shuffledProducts.slice(0, 4);

    const popularProducts = allProducts
      .sort((a, b) => {
        return b.buyer.length - a.buyer.length;
      })
      .slice(0, sliceToProduct);

    const trendingCategories = await CategoriesModel.find({})
      .populate({
        path: "products",
        select: "thumbnail",
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Products Matching Successful",
      data: {
        latestProducts,
        randomProducts,
        popularProducts,
        trendingCategories,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot Fetch Products Data",
      error: error.message,
    });
  }
};

exports.getProductDetails = async (req, res) => {
  try {
    const { productId } = req.body;
    const productDetails = await ProductModel.findOne({
      _id: productId,
    })
      .populate({
        path: "supplier",
        select: "-password",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate({
        path: "ratingAndReviews",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .populate({
        path: "productContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    if (!productDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find productId with id: ${productId}`,
      });
    }

    productDetails.ratingAndReviews.sort((a, b) => b.rating - a.rating);

    return res.status(200).json({
      success: true,
      data: productDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const updates = req.body;
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      const uploadFile = async (file, field) => {
        if (file) {
          const uploadImage = await uploadFileToCloudinary(
            file,
            process.env.FOLDER_NAME
          );
          product[field] = uploadImage.secure_url;
        }
      };

      await Promise.all([
        uploadFile(req.files.thumbnail, "thumbnail"),
        uploadFile(req.files.backSideImage, "backSideImage"),
        uploadFile(req.files.sideImage1, "sideImage1"),
        uploadFile(req.files.sideImage2, "sideImage2"),
      ]);
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tags" || key === "specifications") {
          product[key] = JSON.parse(updates[key]);
        } else {
          product[key] = updates[key];
        }
      }
    }

    await product.save();

    const updatedProduct = await ProductModel.findOne({
      _id: productId,
    })
      .populate({
        path: "supplier",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "productContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getSupplierProducts = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const products = await ProductModel.find({ supplier: supplierId })
      .sort({
        createdAt: -1,
      })
      .populate("category");

    if (!products) {
      return res.status(404).json({
        succcess: false,
        message: "Product not Found",
      });
    }

    return res.status(200).json({
      success: true,
      data: products,
      message: "Product Found successfully",
    });
  } catch (error) {
    console.error("Error At Supplier Products", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteProducts = async (req, res) => {
  try {
    const { productId } = req.body;
    console.log("productId ====> ", productId);
    const supplierId = req.user.id;

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const ratings = product.ratingAndReviews;
    for (const reviewId of ratings) {
      await RatingAndReview.findByIdAndDelete(reviewId);
    }

    const buyers = product.buyer;
    for (const buyerId of buyers) {
      await UserModel.findByIdAndUpdate(buyerId, {
        $pull: { products: productId },
      });
    }

    const productSections = product.productContent;
    for (const sectionId of productSections) {
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }
      await Section.findByIdAndDelete(sectionId);
    }

    await UserModel.findByIdAndUpdate(
      supplierId,
      {
        $pull: { products: productId },
      },
      { new: true }
    );

    await CategoriesModel.findByIdAndUpdate(
      { _id: product.category },
      { $pull: { products: productId } },
      { new: true }
    );

    await ProductModel.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product Deleted",
    });
  } catch (error) {
    console.error("Error At deleteProducts", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getSearchedProduct = async (req, res) => {
  try {
    const { key } = req.body;

    const findProduct = await ProductModel.find({
      $or: [
        { productName: { $regex: key, $options: "i" } },
        { brand: { $regex: key, $options: "i" } },
      ],
    })
      .populate({
        path: "category",
        match: { name: { $regex: key, $options: "i" } }, 
        select: "name",
      })
      .select("thumbnail ratingAndReviews productName price category")
      .populate("ratingAndReviews")
      .exec();

    if (findProduct.length === 0) {
      return res.status(400).json({
        succcess: false,
        message: "Product Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      data: findProduct,
      message: "Product Found",
    });
  } catch (error) {
    console.error("Error At SearchProduct", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      error: error.message,
    });
  }
};
