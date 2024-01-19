const Category = require("../model/Category");
const Product = require("../model/Product")

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return (
        res.status(400),
        json({
          success: false,
          message: "Please Enter Category",
        })
      );
    }

    const categoryDetails = await Category.create({
      name,
      description,
    });

    console.log("Create categoryDetails =====> ", categoryDetails);
    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const allCategory = await Category.find(
      {},
      { name: true, description: true }
    );
    return res.status(200).json({
      success: true,
      data: allCategory,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId, page = 1, pageSize = 10 } = req.body;

    const totalProductsCount = await Product.countDocuments({
      category: categoryId,
      status: "Published",
    });

    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "products",
        options:{
          skip: (page - 1) * pageSize,
          limit: pageSize,
        },
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec();

    // console.log("SELECTED PRODUCT", selectedCategory);
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Data Not Found",
      });
    }

    const uniqueBrands = []
 
    for(const item of selectedCategory.products){
        if(uniqueBrands.includes(item.brand)) continue;
        uniqueBrands.push(item.brand)
    }

    if (selectedCategory.products.length === 0) {
      console.log("No Products found for the selected category.");
      return res.status(404).json({
        success: false,
        message: "No Products found for the selected category.",
      });
    }

    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });

    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    ).populate({
        path: "products",
        match: { status: "Published" },
        populate: {
          path: "ratingAndReviews",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      total:totalProductsCount,
      data: {
        selectedCategory,
        differentCategory,
        brands:uniqueBrands,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
