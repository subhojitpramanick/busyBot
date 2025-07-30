import { Download, Edit, Image } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Set the base URL for all axios requests
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const imageStyle = [
    "Realistic",
    "Cartoon",
    "Anime",
    "Ghibli",
    "Fantasy",
    "3D Style",
    "Portrait Style",
  ];
  // --- State with localStorage persistence ---
  const [selectedStyle, setSelectedStyle] = useState(
    () => localStorage.getItem("generateImages.selectedStyle") || imageStyle[0]
  );
  const [input, setInput] = useState(
    () => localStorage.getItem("generateImages.input") || ""
  );
  const [publish, setPublish] = useState(
    () => JSON.parse(localStorage.getItem("generateImages.publish")) || false
  );
  const [content, setContent] = useState(""); // This is reset on each generation
  const [isDownloading, setIsDownloading] = useState(false);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    localStorage.setItem("generateImages.input", input);
  }, [input]);

  useEffect(() => {
    localStorage.setItem("generateImages.selectedStyle", selectedStyle);
  }, [selectedStyle]);

  useEffect(() => {
    localStorage.setItem("generateImages.publish", JSON.stringify(publish));
  }, [publish]);

  // --- Mutation for generating an image ---
  const { mutate: generateImage, isPending: loading } = useMutation({
    mutationFn: async ({ prompt, publish }) => {
      const token = await getToken();
      if (!token) throw new Error("Authentication token not found.");
      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!data.success) {
        toast.error(data.message || "Failed to generate image.");

        throw new Error(data.message || "Failed to generate image.");
      }
      return data.content; // Return the image URL
    },
    onSuccess: (newContent) => {
      setContent(newContent);
      toast.success("Image generated successfully!");
      setInput(""); // Clear the input field after success
      // Invalidate queries to refetch data on other pages like the Dashboard
      queryClient.invalidateQueries({ queryKey: ["userCreations"] });
      if (publish) {
        queryClient.invalidateQueries({ queryKey: ["publishedCreations"] });
      }
    },
    onError: (error) => {
      toast.error(error.message || "An unexpected error occurred.");
    },
  });

  // Handles the form submission to the image generation API
  const onSubmitHandeler = (e) => {
    e.preventDefault();
    const prompt = `Generate an image of ${input} in ${selectedStyle} style`;
    generateImage({ prompt, publish });
  };

  // Handles downloading the generated image from its URL
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
      link.setAttribute("download", `generated-image-${Date.now()}.png`);

      // Append, click, and remove the anchor tag
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the temporary URL
      window.URL.revokeObjectURL(url);

      toast.success("Download started!", { id: toastId });
    } catch (error) {
      console.error("Download failed:", error);
      // Check for common network or CORS errors
      if (error.message.includes("Network Error")) {
        toast.error(
          "Download failed. This may be due to a network or CORS issue on the image server.",
          { id: toastId }
        );
      } else {
        toast.error("Failed to download image.", { id: toastId });
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-4 sm:p-8 flex items-start justify-center flex-wrap gap-8 text-slate-700 bg-gradient-to-br from-yellow-50 via-pink-50 to-indigo-100 min-h-screen">
      {/* Left Section: Input Form */}
      <form
        onSubmit={onSubmitHandeler}
        className="w-full max-w-lg p-6 bg-white/80 rounded-2xl shadow-lg border border-yellow-200"
        style={{ backdropFilter: "blur(8px)" }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Image className="w-8 h-8 text-yellow-500" />
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600">
            Premium Image Generator
          </h1>
        </div>
        <p className="mt-6 text-sm font-medium">Describe Your Image</p>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className="w-full p-2 px-3 mt-2 outline-none text-base rounded-lg border border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all"
          placeholder="e.g., A cute cat wearing sunglasses"
          rows={4}
          required
        />
        <p className="mt-4 text-sm font-medium">Style</p>
        <div className="mt-3 flex gap-3 flex-wrap">
          {imageStyle.map((item) => (
            <span
              key={item}
              className={`text-xs px-4 py-1.5 border rounded-full cursor-pointer font-semibold transition-all duration-200 ${
                selectedStyle === item
                  ? "bg-gradient-to-r from-pink-400 to-yellow-400 border-transparent text-white shadow"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setSelectedStyle(item)}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-2 peer-focus:ring-pink-300 transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-pink-400 peer-checked:to-yellow-400"></div>
            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-5"></span>
            <span className="ml-3 text-sm font-medium text-gray-700">
              Make Public
            </span>
          </label>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 via-pink-500 to-pink-600 text-white font-bold px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300 mt-6 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-5 h-5 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
          ) : (
            <Edit className="inline w-5 h-5" />
          )}
          Generate Image
        </button>
      </form>

      {/* Right Section: Generated Image Output */}
      <div
        className="w-full max-w-lg p-6 bg-white/80 rounded-2xl shadow-lg flex flex-col border border-yellow-200 min-h-[400px] max-h-[600px]"
        style={{ backdropFilter: "blur(8px)" }}
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Image className="w-7 h-7 text-yellow-500" />
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600">
              Generated Image
            </h1>
          </div>
          {/* Download Button - Appears only when there is content */}
          {content && (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-400 to-yellow-400 text-white font-semibold rounded-lg shadow hover:from-pink-500 hover:to-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="text-base flex flex-col items-center gap-5 text-yellow-600 p-4">
              <Image className="w-14 h-14 text-yellow-400" />
              <p className="text-center font-medium">
                Your generated image will appear here.
              </p>
            </div>
          ) : (
            <img
              src={content}
              alt="Generated result"
              className="w-full h-full object-contain rounded-lg"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;
