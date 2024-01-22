import React, { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

const Upload = ({
  label,
  name,
  register,
  setValue,
  errors = "",
  editData,
  req,
}) => {
  const [images, setImages] = useState(null);
  const [previewImage, setPreviewImage] = useState(editData ? editData : "");
  const [hideShowImage, setHideShowImage] = useState(false);

  useEffect(() => {
    if (editData) {
      setHideShowImage(true);
    }
    register(name, { required: req });
    // eslint-disable-next-line
  }, [register]);

  useEffect(() => {
    setValue(name, images);
    // eslint-disable-next-line
  }, [images, setValue]);

  const handleChangeImage = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        preview(file);
        setImages(file);
        setHideShowImage(true);
      }
    },
    // eslint-disable-next-line
    [images]
  );

  const preview = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
  };
  return (
    <div className="flex flex-col ">
      <label htmlFor={name}>
        {label}
        {req && <sup className="text-red-500">*</sup>}{" "}
      </label>
      <input
        type="file"
        name={name}
        id={name}
        className="hidden"
        onChange={handleChangeImage}
        key={images ? images.name : ""}
      />
      <div className="min-h-[250px] w-full border border-slate-500 border-dashed  bg-[#2C333F] rounded-lg flex justify-center items-center object-cover ">
        {!hideShowImage ? (
          <label
            htmlFor={name}
            className="min-h-[250px] w-full cursor-pointer flex items-center justify-center "
          >
            <FiUploadCloud className="text-yellow-400 text-3xl" />
          </label>
        ) : (
          <div
            className=" w-full rounded-lg object-cover flex flex-col p-4"
            // className=" w-full rounded-lg flex flex-col gap-2 justify-center items-center"
          >
            <img
              src={previewImage}
              alt="Thumbnail"
              className="max-h-[265px] h-full rounded-lg max-w-[265px] w-full object-cover aspect-square mx-auto"
            />
            <button
              className="text-white py-1 my-2 px-3 bg-[#161d29] rounded-md"
              onClick={() => {
                setPreviewImage("");
                setHideShowImage(false);
                setImages(null);
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-red-600">
          {label} is Required
        </span>
      )}
    </div>
  );
};

export default Upload;
