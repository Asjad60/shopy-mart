import { useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { HiMiniXMark } from "react-icons/hi2";

const FilterProductsSidebar = ({
  brands,
  setSelectedBrand,
  selectedBrand,
}) => {
  const [transformed, setTransformed] = useState(false);

    const handleChangebrands = (brand) => {
      setSelectedBrand((prevSelectedBrands) => {
        if (prevSelectedBrands.includes(brand)) {
          return prevSelectedBrands.filter((selectedBrand) => selectedBrand !== brand);
        } else {
          return [...prevSelectedBrands, brand];
        }
      });
    };
    

  return (
    <div className="z-[1000]">
      <button
        className="absolute top-3 left-3 md:hidden z-10"
        onClick={() => setTransformed((prev) => !prev)}
      >
        <RiMenu2Fill size={30} />
      </button>
      <div
        className={`w-[220px] min-h-[calc(100vh-57px)] bg-[#161d29] divide-y divide-[#2c333f]
      absolute transition-all ease-in-out duration-200 md:static border-r border-r-[#2c333f] ${
        transformed ? "left-0" : "left-[-100%]"
      }`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-medium pt-8">Filters</h2>
          <div className="flex gap-2 w-full flex-wrap mt-2">
            {selectedBrand?.map((brand, i) => (
              <div
                className="bg-[#2c333f] flex gap-1  rounded-3xl py-1 px-3"
                key={i}
              >
                <button onClick={() => handleChangebrands(brand)}>
                  <HiMiniXMark />
                </button>
                <p className={`${
                  brand === "realme" ? "" : "uppercase "
                }`}>{brand}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col mt-10  pb-6">
          <h2 className="text-xl font-medium p-6">Brand</h2>
          {brands?.map((brand, i) => (
            <div key={i} className="flex gap-2 ml-6 ">
              <input
                type="checkbox"
                id={brand}
                className="cursor-pointer"
                onChange={() => handleChangebrands(brand)}
                checked={selectedBrand.includes(brand)}
              />
              <label
                htmlFor={brand}
                className={`${
                  brand === "realme" ? "" : "uppercase "
                } cursor-pointer `}
              >
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterProductsSidebar;
