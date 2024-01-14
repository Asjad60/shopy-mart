import { useState } from "react";
import IconButton from "./IconButton";

const AddressForm = ({ modalData }) => {
  const [address, setAddress] = useState({
    address: "",
    city: "",
    pincode: "",
    state: "",
    country: "",
  });

  const handleSubmitForm = (e) => {
    e.preventDefault();
    modalData?.btn2Handler(address);

    setAddress({
      address: "",
      city: "",
      pincode: "",
      state: "",
      country: "",
    });
  };

  const handleChange = (e) => {
    setAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className=" fixed inset-0 bg-[rgba(0,0,0,0.2)] flex items-center justify-center backdrop-blur-[2px] text-white">
      <div className="border border-slate-500 bg-slate-800 max-w-[500px] w-full p-4">
        <h1 className="font-medium text-3xl mb-4">Address</h1>
        <form onSubmit={handleSubmitForm} className="flex flex-col gap-5">
          <div className="w-full flex flex-col">
            <label htmlFor="address">Address</label>
            <textarea
              type="text"
              placeholder="Enter Address"
              name="address"
              id="address"
              value={address.address}
              onChange={handleChange}
              className=" resize-none form-style"
            ></textarea>
          </div>
          <div className="w-full flex gap-3">
            <div className="w-full">
              <label htmlFor="city">City</label>
              <input
                type="text"
                placeholder="Enter City"
                name="city"
                id="city"
                value={address.city}
                onChange={handleChange}
                className="form-style w-full"
              />
            </div>
            <div className="w-full">
              <label htmlFor="pincode">Pincode</label>
              <input
                type="number"
                placeholder="Enter Pincode"
                name="pincode"
                id="pincode"
                value={address.pincode}
                onChange={handleChange}
                className="form-style w-full"
              />
            </div>
          </div>
          <div className="w-full flex gap-3">
            <div className="w-full">
              <label htmlFor="state">State</label>
              <input
                type="text"
                placeholder="Enter State"
                name="state"
                id="state"
                value={address.state}
                onChange={handleChange}
                className="form-style w-full"
              />
            </div>
            <div className="w-full">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                placeholder="Enter Country"
                name="country"
                id="country"
                value={address.country}
                onChange={handleChange}
                className="form-style w-full"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              className="font-medium bg-[#161d29] py-2 px-4 rounded-md"
              onClick={modalData?.btn1Handler}
            >
              {modalData?.btn1Text}
            </button>

            <IconButton
              type={"submit"}
              text={modalData?.btn2Text}
              customClasses={"px-4"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
