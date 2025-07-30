import { Download, Scissors, Sparkle, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

// Set the base URL for all axios requests
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(""); // Stores the processed image URL
  const [isDownloading, setIsDownloading] = useState(false);
  const { getToken } = useAuth();

  // Handles the form submission to the object removal API
  const onSubmitHandeler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", input);
      formData.append("object", object);

      if (object.split(" ").length > 1) {
        toast.error("Please enter a single object name.");
        return;
      }

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Object removed successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Handles downloading the processed image from the Cloudinary URL
  const handleDownload = async () => {
    if (!content) return;

    setIsDownloading(true);
    const toastId = toast.loading("Preparing download...");

    try {
      // Fetch the image as a 'blob' to handle the binary data
      const response = await axios.get(content, {
        responseType: "blob",
      });

      // Create a temporary URL from the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary anchor tag to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `processed-${Date.now()}.png`);

      // Append, click, and remove the anchor tag
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the temporary URL
      window.URL.revokeObjectURL(url);

      toast.success("Download started!", { id: toastId });
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download image.", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-4 sm:p-8 flex items-start justify-center flex-wrap gap-8 text-slate-700 bg-gradient-to-br from-indigo-100 to-pink-100 min-h-screen">
      {/* Left Section: Input Form */}
      <form
        onSubmit={onSubmitHandeler}
        className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-lg border border-orange-200"
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-7 h-7 text-orange-500 drop-shadow" />
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-300 to-pink-400">
            Object Removal
          </h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <div className="flex flex-col gap-2 mt-2 w-full">
          <input
            onChange={(e) => setInput(e.target.files[0])}
            type="file"
            accept="image/*"
            className="w-full p-2 px-3 outline-none text-base rounded-lg border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all min-w-0"
            required
          />
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <button
              type="button"
              className="px-4 py-2 w-full sm:w-auto bg-gradient-to-r from-orange-400 to-pink-400 text-white font-semibold rounded-lg shadow hover:from-orange-500 hover:to-pink-500 transition-colors"
              onClick={() => document.querySelector("input[type=file]").click()}
            >
              Add File
            </button>
            <button
              type="button"
              className="px-4 py-2 w-full sm:w-auto bg-gradient-to-r from-gray-200 to-orange-200 text-orange-700 font-semibold rounded-lg shadow hover:from-gray-300 hover:to-orange-300 transition-colors"
              onClick={() => {
                setInput("");
                const fileInput = document.querySelector("input[type=file]");
                if (fileInput) fileInput.value = "";
              }}
              disabled={!input}
            >
              Remove File
            </button>
          </div>
        </div>
        <p className="mt-6 text-sm font-medium">
          Describe Object Name to Remove
        </p>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          className="w-full p-2 px-3 mt-2 outline-none text-base rounded-lg border border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all"
          placeholder="e.g., Watch or Spoon (single object name only)"
          rows={4}
          required
        />

        <button
          disabled={loading}
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold px-4 py-3 rounded-full shadow-lg hover:scale-105 hover:from-orange-600 hover:to-pink-600 transition-all duration-300 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-5 h-5 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
          ) : (
            <Scissors className="inline w-5 h-5" />
          )}
          Remove Object
        </button>
      </form>

      {/* Right Section: Processed Image Output */}
      <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-lg flex flex-col border border-orange-200 min-h-[400px] max-h-[600px]">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Scissors className="w-6 h-6 text-orange-500 drop-shadow" />
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-300 to-pink-400">
              Processed Image
            </h1>
          </div>
          {/* Download Button - Appears only when there is content */}
          {content && (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-400 text-white font-semibold rounded-lg shadow hover:from-orange-500 hover:to-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
              ) : (
                <Download className="w-5 h-5" />
              )}
              Download
            </button>
          )}
        </div>

        <div className="flex-1 flex justify-center items-center bg-gray-50 rounded-lg">
          {!content ? (
            <div className="text-base flex flex-col items-center gap-5 text-orange-400 p-4">
              <Sparkle className="w-12 h-12 text-orange-300" />
              <p className="text-center font-medium">
                Your processed image will appear here.
              </p>
            </div>
          ) : (
            <img
              src={content}
              alt="Processed result"
              className="w-full h-full object-contain rounded-lg"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveObject;
