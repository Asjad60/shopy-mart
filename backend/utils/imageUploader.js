const cloudinary = require("cloudinary").v2;

exports.uploadFileToCloudinary = async (file, folder, height, quality) => {
  let options = { folder };

  if (height) {
    options.height = height;
  }

  if (quality) {
    options.quality = quality;
  }

  options.resource_type = "auto";
  console.log("file.tempFilePath ===> ", file.tempFilePath);

  return await cloudinary.uploader.upload(file.tempFilePath, options);
};
