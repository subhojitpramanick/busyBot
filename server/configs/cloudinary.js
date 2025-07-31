import { v2 as cloudinary } from "cloudinary";

const conectCloudinary = () => {
  // --- Start of new logging code ---
  console.log("--- Attempting to configure Cloudinary ---");
  console.log(
    "Found CLOUDINARY_CLOUD_NAME:",
    process.env.CLOUDINARY_CLOUD_NAME
  );
  console.log("Found CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
  console.log(
    "Found CLOUDINARY_API_SECRET:",
    process.env.CLOUDINARY_API_SECRET ? "Exists" : "Not Found"
  ); // Hide the secret itself
  // --- End of new logging code ---

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export default conectCloudinary;
