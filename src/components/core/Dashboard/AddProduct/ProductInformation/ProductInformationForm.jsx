import React from "react";
import { useEffect } from "react";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { getCategories } from "../../../../../services/operations/productApi";
import { useState } from "react";
import ChipInput from "./ChipInput";
import Upload from "../Upload";
import Specification from "./Specification";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { setProduct, setStep } from "../../../../../slices/productSlice";
import IconButton from "../../../../common/IconButton";
import { MdNavigateNext } from "react-icons/md";
import { toast } from "react-hot-toast";
import { editProductDetails } from "../../../../../services/operations/productApi";
import { addProductDetails } from "../../../../../services/operations/productApi";
import { PRODUCT_STATUS } from "../../../../../utils/constants";
import ColorNames from "../../../../../data/color-names.json";
import SizeDropdown from "./SizeDropdown/SizeDropdown";

const ProductInformationForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [productCategory, setProductCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { product, editProduct } = useSelector((state) => state.product);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await getCategories();
        if (categories.length > 0) {
          setProductCategory(categories);

          if (editProduct) {
            setValue("productTitle", product.productName);
            setValue("productDescription", product.productDescription);
            setValue("price", product.price);
            setValue("productTags", product.tags);
            setValue("category", product.category._id);
            setValue("productImage", product.thumbnail);
            setValue("backImage", product.backSideImage);
            setValue("side1", product.sideImage1);
            setValue("side2", product.sideImage2);
            setValue("specifications", product.specifications);
            setValue("brand", product.brand);
            setValue("stock", product.stock);
            setValue("color", product.color);
            setValue("sizes", product.sizes);

            handleCategoryChange(product.category._id,categories)
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editProduct]);

  const currentFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.productTitle !== product.productName ||
      currentValues.productDescription !== product.productDescription ||
      currentValues.price !== product.price ||
      currentValues.productTags.toString() !== product.tags.toString() ||
      currentValues.productImage !== product.thumbnail ||
      currentValues.category !== product.category._id ||
      currentValues.specifications.toString() !==
        product.specifications.toString() ||
      currentValues.backImage !== product.backSideImage ||
      currentValues.side1 !== product.sideImage1 ||
      currentValues.side2 !== product.sideImage2 ||
      currentValues.brand !== product.brand ||
      currentValues.stock !== product.stock ||
      currentValues.color !== product.color ||
      JSON.stringify(currentValues.sizes) !== JSON.stringify(product.sizes) 
    ) {
      return true;
    } else return false;
  };

  //handle next button
  const onSubmit = async (data) => {
    if (editProduct) {
      // console.log("Has Form Changed:", currentFormUpdated())
      if (currentFormUpdated()) {
        const currentValue = getValues();
        // console.log("consoling current vaalue =====> ", currentValue);
        const formData = new FormData();

        formData.append("productId", product._id);
        if (currentValue.productTitle !== product.productName) {
          formData.append("productName", data.productTitle);
        }
        if (currentValue.price !== product.price) {
          formData.append("price", data.price);
        }
        if (currentValue.productDescription !== product.productDescription) {
          formData.append("productDescription", data.productDescription);
        }
        if (currentValue.productTags.toString() !== product.tags.toString()) {
          formData.append("tags", JSON.stringify(data.productTags));
        }
        if (currentValue.category !== product.category._id) {
          formData.append("category", data.category);
        }
        if (
          currentValue.specifications.toString() !==
          product.specifications.toString()
        ) {
          formData.append(
            "specifications",
            JSON.stringify(data.specifications)
          );
        }
        if (currentValue.productImage !== product.thumbnail) {
          formData.append("thumbnail", data.productImage);
        }
        if (currentValue.backImage !== product.backSideImage) {
          formData.append("backSideImage", data.backImage);
        }
        if (currentValue.side1 !== product.sideImage1) {
          formData.append("sideImage1", data.side1);
        }
        if (currentValue.side2 !== product.sideImage2) {
          formData.append("sideImage2", data.side2);
        }
        if (currentValue.brand !== product.brand) {
          formData.append("brand", data.brand);
        }
        if (currentValue.stock !== product.stock) {
          formData.append("stock", data.stock);
        }
        if (currentValue.color !== product.color) {
          formData.append("color", data.color);
        }
        if (JSON.stringify(currentValue.sizes) !== JSON.stringify(product.sizes) ) {
          formData.append("sizes", JSON.stringify(data.sizes));
        }

        setLoading(true);
        const result = await editProductDetails(formData, token);
        setLoading(false);
        if (result) {
          dispatch(setStep(2));
          dispatch(setProduct(result));
        }
      } else {
        toast.error("No Changes made");
      }
      return;
    }

    const formData = new FormData();
    formData.append("productName", data.productTitle);
    formData.append("productDescription", data.productDescription);
    formData.append("price", data.price);
    formData.append("tags", JSON.stringify(data.productTags));
    formData.append("category", data.category);
    formData.append("specifications", JSON.stringify(data.specifications));
    formData.append("thumbnail", data.productImage);
    formData.append("backSideImage", data.backImage);
    formData.append("sideImage1", data.side1);
    formData.append("sideImage2", data.side2);
    formData.append("brand", data.brand);
    formData.append("stock", data.stock);
    formData.append("color", data.color);
    formData.append("status", PRODUCT_STATUS.DRAFT);
    if (selectedCategory === "Clothing" || selectedCategory === "Footwear") {
      formData.append("sizes", JSON.stringify(data.sizes))
    }

    setLoading(true);
    const result = await addProductDetails(formData, token);
    if (result) {
      dispatch(setStep(2));
      dispatch(setProduct(result));
    }
    setLoading(false);
  };

  function handleCategoryChange(value ,categories){
    // console.log("values ==> ",value)
    const selectedCategories = categories.find(
      (category) => category._id === value
    );
    // console.log("selectedCategories ===> ", selectedCategories);
    setSelectedCategory(selectedCategories?.name);
  };

  return (
    <form
      className="flex flex-col gap-5 p-6 select-none bg-[#161d29] rounded-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-y-1">
        <label htmlFor="productTitle">
          Product Title<sup className="text-red-500 ">*</sup>
        </label>
        <input
          type="text"
          placeholder="Enter Product Title"
          id="productTitle"
          name="productTitle"
          {...register("productTitle", { required: true })}
          className="bg-[#2C333F] outline-none p-3 rounded-md border-b border-b-slate-300"
        />
        {errors.productTitle && (
          <span className="ml-2 text-xs tracking-wide text-red-600">
            Product title is required
          </span>
        )}
      </div>
      <div className="flex flex-col gap-y-1">
        <label htmlFor="productDescription">
          Product Short Description<sup className="text-red-500">*</sup>
        </label>
        <textarea
          name="productDescription"
          id="productDescription"
          placeholder="Enter Description"
          {...register("productDescription", { required: true })}
          className="bg-[#2C333F] resize-x-none outline-none p-3 rounded-md border-b border-b-slate-300 min-h-[150px]"
        ></textarea>
        {errors.productDescription && (
          <span className="ml-2 text-xs tracking-wide text-red-600">
            Product Description is required
          </span>
        )}
      </div>
      <div className=" flex flex-col gap-y-1">
        <label htmlFor="price">
          {" "}
          Product Price <sup className="text-red-500">*</sup>
        </label>
        <div className="relative">
          <input
            type="number"
            placeholder="Enter Product Price"
            id="price"
            name="price"
            {...register("price", { required: true })}
            className="appearance-none bg-[#2C333F] outline-none p-3 !pl-12 rounded-md border-b border-b-slate-300  w-full"
          />
          <span className="absolute bottom-3 left-3 font-medium text-2xl opacity-30 ">
            <HiOutlineCurrencyRupee />
          </span>
        </div>
        {errors.price && (
          <span className="ml-2 text-xs tracking-wide text-red-600">
            Product Price is required
          </span>
        )}
      </div>
      <div className="flex flex-col gap-y-1">
        <label htmlFor="category">
          {" "}
          Product Category <sup className="text-red-500">*</sup>
        </label>
        <select
          name="category"
          id="category"
          {...register("category", { required: true })}
          className="bg-[#2C333F] outline-none p-3 rounded-md border-b border-b-slate-300"
          onChange={(e) => handleCategoryChange(e.target.value,productCategory)}
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {productCategory.map((category, index) => (
            <option key={index} value={category?._id}>
              {category?.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <span className="ml-2 text-xs tracking-wide text-red-600">
            Product Category is required
          </span>
        )}
      </div>

      {(selectedCategory === "Clothing" || selectedCategory === "Footwear") && (
        <SizeDropdown
          categoryName={selectedCategory}
          label={"Select Size"}
          name={"sizes"}
          register={register}
          setValue={setValue}
          errors={errors}
        />
      )}

      <div className="flex flex-col gap-y-1">
        <label htmlFor="color">
          Colour <sup className="text-red-500">*</sup>
        </label>
        <select
          name="color"
          id="color"
          {...register("color", { required: true })}
          className="bg-[#2C333F] outline-none p-3 rounded-md border-b border-b-slate-300"
          defaultValue=""
        >
          <option value="" disabled>
            Choose a Colour
          </option>
          {ColorNames.map((color, index) => (
            <option key={index} value={Object.keys(color)[0].toLowerCase()}>
              {Object.keys(color)[0]}
            </option>
          ))}
        </select>
        {errors.color && (
          <span className="ml-2 text-xs tracking-wide text-red-600">
            Product Colour is required
          </span>
        )}
      </div>

      <ChipInput
        label="Tags"
        name="productTags"
        placeholder="Enter Tags And Press Enter"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />

      <div className="flex flex-col gap-y-1">
        <label htmlFor="brand">
          Brand <sup className="text-red-500 ">*</sup>
        </label>
        <input
          type="text"
          placeholder="Enter Product Brand"
          id="brand"
          name="brand"
          {...register("brand", { required: true })}
          className="bg-[#2C333F] outline-none p-3 rounded-md border-b border-b-slate-300"
        />
        {errors.brand && (
          <span className="ml-2 text-xs tracking-wide text-red-600">
            Brand Name is required
          </span>
        )}
      </div>

      {(selectedCategory !== "Clothing" && selectedCategory !== "Footwear") && (
        <div className="flex flex-col gap-y-1">
          <label htmlFor="stock">
            Stock <sup className="text-red-500 ">*</sup>
          </label>
          <input
            type="number"
            placeholder="Enter Product Stock"
            id="stock"
            name="stock"
            {...register("stock", { required: true })}
            className="bg-[#2C333F] outline-none p-3 rounded-md border-b border-b-slate-300"
          />
          {errors.stock && (
            <span className="ml-2 text-xs tracking-wide text-red-600">
              Product Stock is required
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Upload
          label="Thumbnail | Front Image"
          name="productImage"
          register={register}
          setValue={setValue}
          errors={errors}
          editData={editProduct ? product?.thumbnail : null}
          req={true}
        />
        <Upload
          label="Back Image"
          name="backImage"
          register={register}
          setValue={setValue}
          errors={errors}
          editData={editProduct ? product?.backSideImage : null}
          req={true}
        />
        <Upload
          label="Side-1"
          name="side1"
          register={register}
          setValue={setValue}
          editData={editProduct ? product?.sideImage1 : null}
          req={false}
        />
        <Upload
          label="Side-2"
          name="side2"
          register={register}
          setValue={setValue}
          editData={editProduct ? product?.sideImage2 : null}
          req={false}
        />
      </div>

      <Specification
        label={"Highlights"}
        name="specifications"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />

      <div className="flex justify-end gap-x-2">
        {editProduct && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-slate-300 py-[8px] px-[20px] font-semibold text-slate-900`}
          >
            Continue Wihout Saving
          </button>
        )}
        <IconButton
          type={"submit"}
          disabled={loading}
          text={!editProduct ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconButton>
      </div>
    </form>
  );
};

export default ProductInformationForm;
