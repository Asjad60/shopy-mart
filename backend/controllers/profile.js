const { uploadFileToCloudinary } = require("../utils/imageUploader");
const Profile = require("../model/ProfileModel");
const UserModel = require("../model/User");
const Product = require("../model/Product");
const OrderModal = require("../model/Orders");
const Section = require("../model/Section");
const SubSection = require("../model/SubSection");
const CategoriesModel = require("../model/Category");

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetails = await UserModel.findById(id)
      .populate("additionalDetails")
      .select("-password")
      .exec();
    console.log(userDetails);
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Fetching Profile Details Failed",
    });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    const pic = req.files.pic;
    const userId = req.user.id;

    const image = await uploadFileToCloudinary(
      pic,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image.secure_url);
    const updatedProfile = await UserModel.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    // res.status(200).json({
    //   success: true,
    //   message: `Image Updated successfully`,
    //   data: updatedProfile,
    // });
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, dateOfBirth, about, contactNumber, gender } = req.body;

    const id = req.user.id;

    // if (!name || !dateOfBirth || !contactNumber || !about) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Fill The Details",
    //   });
    // }

    const userDetails = await UserModel.findById(id);
    const profile = await Profile.findById(userDetails.additionalDetails);

    const user = await UserModel.findByIdAndUpdate(id, name);

    await user.save();

    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.gender = gender;

    await profile.save();

    const updatedUserDetails = await UserModel.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Profile Updated",
      updatedUserDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Updating Profile Error",
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;

    const user = await UserModel.findById(id);
    await Profile.findByIdAndDelete(user.additionalDetails);

    for (const productId of user.products) {
      try {
        if (user.accountType === "Visitor") {
          await Product.findByIdAndUpdate(
            productId,
            {
              $pull: { buyer: id },
            },
            { new: true }
          );
        } else if (user.accountType === "Supplier") {
          const product = await Product.findById(productId);

          const buyer = product.buyer;
          for (const buyerId of buyer) {
            await UserModel.findByIdAndUpdate(
              buyerId,
              {
                $pull: { products: productId },
              },
              { new: true }
            );
          }

          const sections = product.productContent;
          for (const sectionId of sections) {
            const section = await Section.findById(sectionId);

            if (section) {
              const subSections = section.subSection;
              for (const subSectionId of subSections) {
                await SubSection.findByIdAndDelete(subSectionId);
              }
            }
            await Section.findByIdAndDelete(sectionId);
          }

          await CategoriesModel.findByIdAndUpdate(
            { _id: product.category },
            { $pull: { products: productId } },
            { new: true }
          );
          await Product.findByIdAndDelete(productId);
        }
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Deleting Products Failed",
        });
      }
    }

    // handling order when user delete account
    if (user.accountType === "Supplier") {
      for (const orderId of user.orders) {
        const order = await OrderModal.findById(orderId);
        await Promise.all([
         UserModel.findByIdAndUpdate(order.customer,{
          $pull :{products: order.product}
         }),
         OrderModal.findByIdAndDelete(orderId)
        ])
      }
    } else if (user.accountType === "Visitor") {       // visitor means buyer
      const orders = await OrderModal.find({ customer: id });

      // updating user(supplier) and product and deleting buyer orders
      for (const order of orders) {
        let updatedProduct;
        if (order.size) {
          updatedProduct = await Product.findByIdAndUpdate(
            order.product,
            {
              $pull: { buyer: id },
              $inc: {
                "sizes.$[elem].stock": order.quantity,
              },
            },
            { new: true, arrayFilters: [{ "elem.size": order.size }] }
          );
        } else {
          updatedProduct = await Product.findByIdAndUpdate(
            order.product,
            {
              $pull: { buyer: id },
              $inc: {
                stock: order.quantity,
              },
            },
            { new: true }
          );
        }

        await Promise.all([
           UserModel.findByIdAndUpdate(
            updatedProduct.supplier,
            { $pull: { orders: order._id } },
            { new: true }
          ),

          OrderModal.findByIdAndDelete(order._id)
        ])
      }
    }

    await UserModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Account Deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Delete Profile Error",
    });
  }
};

// Buyer orders
exports.getMyOrders = async (req, res) => {
  try {
    const id = req.user.id;
    const orderDetails = await OrderModal.find({ customer: id })
      .populate("product")
      .exec();

    if (!orderDetails) {
      return res.status(404).json({
        success: false,
        message: `Could Not Find Data With User Id ${orderDetails}`,
      });
    }

    // console.log("My orders ====> ", orderDetails);
    return res.status(200).json({
      success: true,
      data: orderDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//supplier orders

exports.getSupplierOrders = async (req, res) => {
  try {
    const orders = await UserModel.findById(req.user.id)
      .populate({
        path: "orders",
        populate: [{ path: "product" }, { path: "customer", select: "name" }],
      })
      .select("orders")
      .exec();

    return res.status(200).json({
      success: true,
      data: orders.orders,
    });
  } catch (error) {
    console.log("Supplier order finding Error ", error);
    return res.status(500).json({
      success: false,
      message: "Error Occured While Finding the Orders",
      error: error.message,
    });
  }
};

exports.getSupplierDashboard = async (req, res) => {
  try {
    const productDetails = await Product.find({ supplier: req.user.id });
    if (!productDetails) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    const productData = productDetails.map((product) => {
      const totalBuyers = product.buyer.length;
      const totalPrice = totalBuyers * product.price;

      const allData = {
        _id: product._id,
        productName: product.productName,
        description: product.productDescription,
        totalBuyers,
        totalPrice,
      };

      return allData;
    });

    return res.status(200).json({
      success: true,
      products: productData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
