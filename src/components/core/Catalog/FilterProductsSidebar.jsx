import {  useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { HiMiniXMark } from "react-icons/hi2";

const filterByPrice = [10000, 15000, 20000, 25000, 30000,30000];

const FilterProductsSidebar = ({
  brands,
  setSelectedFilters,
  selectedFilters,
  minAndMaxPrice,
  setMinAndMaxPrice,
  products,
}) => {
  const [transformed, setTransformed] = useState(false);

  const handleChangebrands = (value, isNumeric = false) => {
    setSelectedFilters((prevSelectedBrands) => {
      if (!isNumeric) {
        if (prevSelectedBrands.includes(value)) {
          return prevSelectedBrands.filter(
            (selectedBrand) => selectedBrand !== value
          );
        } else {
          return [...prevSelectedBrands, value];
        }
      } else {
        return prevSelectedBrands;
      }
    });
  };
  function sortMinMaxPrice() {
    const sortedProducts = products?.sort((a, b) => a.price - b.price);
    return { min: sortedProducts[0]?.price, max: sortedProducts.at(-1)?.price };
  }

  useEffect(() => {
    if(products){
      setMinAndMaxPrice({
        min: 0,
        max: sortMinMaxPrice().max,
      });
    }
    //eslint-disable-next-line
  }, [products]);

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
            {selectedFilters?.map((brand, i) => (
              <div
                className="bg-[#2c333f] flex gap-1  rounded-3xl py-1 px-3"
                key={i}
              >
                <button onClick={() => handleChangebrands(brand)}>
                  <HiMiniXMark />
                </button>
                <p className={`${brand === "realme" ? "" : "uppercase "}`}>
                  {brand}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col mt-10  pb-6">
          <div className="flex justify-between p-3">
            <h2 className="text-xl font-medium">Brand</h2>
            {selectedFilters.length > 0 && (
              <button
                className="flex gap-1 items-center bg-[#2c333f] rounded-md p-1"
                onClick={() => {
                  setSelectedFilters([]);
                  setMinAndMaxPrice({
                    min: "",
                    max: "",
                  });
                }}
              >
                <HiMiniXMark /> Clear All
              </button>
            )}
          </div>
          <div className="flex flex-col mt-4">
            {brands?.map((brand, i) => (
              <div key={i} className="flex gap-2 ml-6 ">
                <input
                  type="checkbox"
                  id={brand}
                  className="cursor-pointer"
                  onChange={() => handleChangebrands(brand)}
                  checked={selectedFilters.includes(brand)}
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

        <div className="p-3">
          <h2 className="text-xl font-medium">Price</h2>
          <div className="flex justify-between gap-1 mt-4">
            <div>
              <label htmlFor="minPrice" className="ml-1">
                Min Price
              </label>
              <select
                name="minPrice"
                id="minPrice"
                className="border border-[#2c333f] bg-[#161d29] outline-none p-1 rounded-sm w-full mt-1 text-sm cursor-pointer"
                onChange={(e) => {
                  setMinAndMaxPrice((prev) => ({
                    ...prev,
                    min: parseInt(e.target.value),
                  }));
                  handleChangebrands(e.target.value, true);
                }}
                value={minAndMaxPrice.min}
              >
                <option value={0}>MIN</option>
                {filterByPrice.map((price, i) => {
                  return (
                    <option value={price} key={i}>
                      ₹{price}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label htmlFor="maxPrice" className="ml-1">
                Max Price
              </label>
              <select
                name="maxPrice"
                id="maxPrice"
                className="border border-[#2c333f] bg-[#161d29] outline-none p-1 rounded-sm w-full mt-1 text-sm cursor-pointer"
                onChange={(e) => {
                  setMinAndMaxPrice((prev) => ({
                    ...prev,
                    max: parseInt(e.target.value),
                  }));
                  handleChangebrands(e.target.value, true);
                }}
                value={minAndMaxPrice.max}
              >
                {filterByPrice.map((price, i) => {
                  return (
                    <option value={filterByPrice.length -1 === i ? 1000000 : price} key={i}>
                      ₹{filterByPrice.length -1 === i ? price+"+" : price}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterProductsSidebar;
