import { Edit, Hash } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Health",
    "Lifestyle",
    "Travel",
    "Food",
    "Business",
    "Education",
  ];
  // --- State with localStorage persistence ---
  const [selectedCategory, setSelectedCategory] = useState(
    () =>
      localStorage.getItem("blogTitles.selectedCategory") || blogCategories[0]
  );
  const [input, setInput] = useState(
    () => localStorage.getItem("blogTitles.input") || ""
  );
  const [content, setContent] = useState(
    () => localStorage.getItem("blogTitles.content") || ""
  );
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  // --- Persist state to localStorage on change ---
  useEffect(() => {
    localStorage.setItem("blogTitles.input", input);
  }, [input]);

  useEffect(() => {
    localStorage.setItem("blogTitles.selectedCategory", selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    // Persist the generated content as well
    localStorage.setItem("blogTitles.content", content);
  }, [content]);

  // --- Mutation for generating blog titles ---
  const { mutate: generateTitles, isPending: loading } = useMutation({
    mutationFn: async (prompt) => {
      const token = await getToken();
      if (!token) throw new Error("Authentication token not found.");
      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!data.success) {
        throw new Error(data.message || "Failed to generate blog titles.");
      }
      return data.content;
    },
    onSuccess: (newContent) => {
      setContent(newContent);
      toast.success("Blog titles generated successfully!");
      setInput(""); // Clear input on success
      queryClient.invalidateQueries({ queryKey: ["userCreations"] });
    },
    onError: (error) => {
      toast.error(error.message || "An unexpected error occurred.");
    },
  });

  const onSubmitHandeler = (e) => {
    e.preventDefault();
    const prompt = `Generate a blog title for the Keyword ${input} in the category ${selectedCategory}`;
    generateTitles(prompt);
  };

  const handleClearForm = () => {
    setInput("");
    setSelectedCategory(blogCategories[0]);
    setContent("");
    localStorage.removeItem("blogTitles.input");
    localStorage.removeItem("blogTitles.selectedCategory");
    localStorage.removeItem("blogTitles.content");
    toast.success("Form has been cleared");
  };

  return (
    <div className="h-full overflow-y-scroll p-8 flex items-start flex-wrap gap-8 text-slate-700 bg-gradient-to-br from-indigo-100 to-pink-100 min-h-screen">
      {/* Left Section */}
      <form
        onSubmit={onSubmitHandeler}
        className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-2">
          <Edit className="w-7 h-7 text-pink-500 drop-shadow" />
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-fuchsia-500 to-pink-500">
            Blog Title Generator
          </h1>
        </div>
        <p className="mt-6 text-sm font-medium">Keyword</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-base rounded-lg border border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all"
          placeholder="Enter Blog keyword..."
          required
        />
        <p className="mt-4 text-sm font-medium">Category</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {blogCategories.map((item) => (
            <span
              key={item}
              className={`text-xs px-4 py-1 border-2 rounded-full cursor-pointer font-semibold transition-all duration-200 ${
                selectedCategory === item
                  ? "bg-gradient-to-r from-pink-200 to-indigo-200 border-pink-400 text-pink-700 shadow"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setSelectedCategory(item)}
            >
              {item}
            </span>
          ))}
        </div>
        <br />
        <div className="w-full flex flex-wrap items-center gap-2 mt-6">
          <button
            disabled={loading}
            type="submit"
            className="flex-grow flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold px-4 py-2 rounded-full shadow-lg hover:scale-105 hover:from-fuchsia-500 hover:to-pink-600 transition-all duration-300"
          >
            {loading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
            ) : (
              <Edit className="inline mr-2" />
            )}
            Generate Titles
          </button>
          <button
            type="button"
            onClick={handleClearForm}
            className="px-4 py-2 text-sm font-semibold rounded-full bg-gray-200 text-gray-700 shadow-sm hover:bg-gray-300 transition-all duration-200"
          >
            Clear
          </button>
        </div>
      </form>
      {/* Right Section */}
      <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl flex flex-col border border-gray-100 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3 mb-2">
          <Hash className="w-6 h-6 text-pink-500 drop-shadow" />
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-fuchsia-500 to-pink-500">
            Generated Titles
          </h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-base flex flex-col items-center gap-5 text-gray-400">
              <Hash className="w-10 h-10 text-indigo-300" />
              <p className="text-center">
                Enter a topic and click{" "}
                <span className="font-bold text-pink-400">Generate Titles</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
