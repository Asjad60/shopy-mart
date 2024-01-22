import { useEffect, useState } from "react";
import "./SizeDropdown.css";
import {
  footWearSizes,
  clothingSizes,
} from "../../../../../../data/productForm";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useSelector } from "react-redux";

const SizeDropdown = ({
  categoryName,
  label,
  name,
  register,
  setValue,
  errors,
}) => {
  const [dropdownData, setDropdownData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [checkboxData, setCheckboxData] = useState([]);

  const { editProduct, product } = useSelector((state) => state.product);

  useEffect(() => {
      setDropdownData((prevDropdownData) => {
        const newData = categoryName === "Footwear" ? [...footWearSizes] : [...clothingSizes];
    
        if (editProduct) {
          const updatedData = newData.map((data) => ({
            ...data,
            state: product?.sizes.some((ele) => ele.size === data.size),
          }));
          return updatedData;
        } else {
          return newData;
        }
      })

    if (editProduct) {
      setCheckboxData(product?.sizes);  
    }
    register(name, {required:true})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryName, editProduct]);

  useEffect(() => {
    setValue(name, checkboxData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkboxData]);

  const handleChange = (i) => {
    const updatedcheckbox = [...dropdownData];
    updatedcheckbox[i].state = !updatedcheckbox[i].state;
    setDropdownData(updatedcheckbox);
  };

  const handleApply = () => {
    const filteredCheckboxData = dropdownData.filter((data) => data.state);
    setCheckboxData(
      filteredCheckboxData.map((data) => ({
        size: data.size,
        stock: data.stock,
      }))
    );

    setShowDropdown(false);
  };

  const handleClear = () => {
    const clearedData = dropdownData.map((data) => ({ ...data, state: false }));
    setDropdownData(clearedData);
    setCheckboxData([])
  };

  const handleStockChange = (index, value) => {
    setCheckboxData((prevCheckboxData) => {
      const updatedCheckboxData = [...prevCheckboxData];
      updatedCheckboxData[index] = { ...prevCheckboxData[index], stock: value };
      return updatedCheckboxData;
    });
  };
  

  return (
    <div>
      <label
        htmlFor="sizeDropdown"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        {label} <sup className="text-red-500 ">*</sup>
      </label>
      <div
        className="form-style flex items-center justify-between mb-1"
        onClick={() => setShowDropdown((prev) => !prev)}
        id="sizeDropdown"
      >
        <p className="select tracking-widest">
          {checkboxData.length > 0
            ? checkboxData.map((box, i) => box.size).toString()
            : "Select"}
        </p>
        <MdOutlineKeyboardArrowDown size={20} className="" />
      </div>

      {showDropdown && (
        <div className="checkboxParent">
          <div className="gridbox">
            {dropdownData.length > 0 &&
              dropdownData.map((checkbox, index) => (
                <div
                  key={checkbox.id}
                  style={{ display: "flex", gap: "5px", alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    onChange={() => handleChange(index)}
                    id={checkbox.id}
                    name={name}
                    value={checkbox.size}
                    checked={checkbox.state}
                  />
                  <label htmlFor={checkbox.id} className="text-white">
                    {checkbox.size}
                  </label>
                </div>
              ))}
          </div>
          <div className="clear__apply__btn">
            <button onClick={handleClear} type="button">
              Clear Filter
            </button>
            <button onClick={handleApply} type="button">
              Apply
            </button>
          </div>
        </div>
      )}

      {(checkboxData.length > 0 || editProduct) && (
        <div className="w-full border border-[#2c333f] p-4 gap-2">
          <div className="flex gap-10 mb-2 justify-between">
            <p className="text-gray-400">Size</p>
            <p className="pr-24 text-gray-400">Stock</p>
          </div>
          <div className="flex flex-col gap-2">
            {checkboxData.length > 0 &&
              checkboxData.map((size, i) => (
                <div
                  className="flex gap-4 items-center justify-between"
                  key={i}
                >
                  <label>{size.size}</label>
                  <input
                    type="number"
                    className="form-style"
                    name={name}
                    defaultValue={size.stock}
                    onChange={(e) => handleStockChange(i, e.target.value)}
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-red-600">
          {label} is required
        </span>
      )}
    </div>
  );
};

export default SizeDropdown;
