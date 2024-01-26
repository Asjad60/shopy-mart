import {useState,useEffect} from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoArrowForwardCircleOutline } from "react-icons/io5";

const ChipInput = ({
  label,
  name,
  placeholder,
  register,
  setValue,
  errors,
  getValues,
}) => {
  const [chips, setChips] = useState([]);
  const [tags, setTags] = useState("");
  const { editProduct, product } = useSelector((state) => state.product);

  useEffect(() => {
    if (editProduct) {
      // const fetchedChips = product?.tags[0].split(",");
      setChips(product?.tags);
    }
    register(name, { required: true, validate: (value) => value.length > 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue(name, chips);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chips]);

  const handleKeydown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const chipValue = e.target.value.trim();
      if (chipValue && !chips.includes(chipValue)) {
        const newChips = [...chips, chipValue];
        setChips(newChips);
        // console.log("new chips", newChips);
        setTags("")
      }
    }
  };

  // handleCHange for mobile onKeyDown is not working on mobile 
  const handleChange = (e) => {
<<<<<<< HEAD
    setTags(e.target.value)
=======
    setTags(e.target.value.trim())
>>>>>>> 1bc4b9220cd05fbeefa5d7b9b07e3be4de80d773
  }

  const handleClick = () =>{
    if (tags && !chips.includes(tags)) {
<<<<<<< HEAD
      const newChips = [...chips, tags.trim()];
=======
      const newChips = [...chips, tags];
>>>>>>> 1bc4b9220cd05fbeefa5d7b9b07e3be4de80d773
      setChips(newChips);
      setTags("")
    }
  }

  const handleDeleteItem = (chipIndex) => {
    const newChips = chips.filter((_, index) => index !== chipIndex);
    setChips(newChips);
  };
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name}>
        {label}
        <sup className="text-red-500">*</sup>
      </label>
      <div className="flex flex-wrap items-center gap-2 ">
        {chips.length > 0 &&
          chips.map((item, index) => (
            <div
              key={index}
              className="flex  gap-x-2 bg-yellow-800 text-white px-3 py-1  rounded-full items-center"
            >
              {item}
              <button type="button" onClick={(e) => handleDeleteItem(index)}>
                <MdClose className="text-sm" />
              </button>
            </div>
          ))}
      </div>
      <div className="relative w-full">
      <input
        type="text"
        name={name}
        id={name}
        value={tags}
        onChange={handleChange}
        placeholder={placeholder}
        onKeyDown={handleKeydown}
        className="bg-[#2C333F] outline-none p-3 rounded-md border-b border-b-slate-300 w-full"
      />
      <button 
      type="button"
<<<<<<< HEAD
      className="absolute right-2 top-3 md:hidden"
=======
      className="absolute right-2 top-3"
>>>>>>> 1bc4b9220cd05fbeefa5d7b9b07e3be4de80d773
      onClick={handleClick}
      >
        <IoArrowForwardCircleOutline size={25}/>
      </button>
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-red-600">
          {label} is required
        </span>
      )}
    </div>
  );
};

export default ChipInput;
