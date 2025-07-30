import { FileText, LucideEdit2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [input, setInput] = useState("");
  // --- State with localStorage persistence for the generated content ---
  const [content, setContent] = useState(
    () => localStorage.getItem("reviewResume.content") || ""
  );
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    localStorage.setItem("reviewResume.content", content);
  }, [content]);

  // --- Mutation for reviewing a resume ---
  const { mutate: reviewResume, isPending: loading } = useMutation({
    mutationFn: async (resumeFile) => {
      const token = await getToken();
      if (!token) throw new Error("Authentication token not found.");

      const formData = new FormData();
      formData.append("resume", resumeFile);

      const { data } = await axios.post("/api/ai/resume-review", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to review resume.");
      }
      return data.content;
    },
    onSuccess: (newContent) => {
      setContent(newContent);
      toast.success("Resume reviewed successfully!");
      queryClient.invalidateQueries({ queryKey: ["userCreations"] });

      // Clear the input state and the file input element
      setInput("");
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    },
    onError: (error) => {
      toast.error(error.message || "An unexpected error occurred.");
    },
  });

  const onSubmitHandeler = (e) => {
    e.preventDefault();
    if (input) reviewResume(input);
  };

  return (
    <div className="h-full overflow-y-scroll p-8 flex items-start flex-wrap gap-8 text-slate-700 bg-gradient-to-br from-blue-100 via-violet-100 to-pink-100 min-h-screen">
      {/* Left Section */}
      <form
        onSubmit={onSubmitHandeler}
        className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-lg border border-violet-300"
      >
        <div className="mb-4 flex justify-end">
          <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 via-pink-400 to-blue-400 text-white font-semibold text-sm shadow-md border border-violet-200">
            Premium Access
          </span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <LucideEdit2 className="w-7 h-7 text-violet-500 drop-shadow" />
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-violet-500 to-pink-400">
            Review Your Resume
          </h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Resume</p>
        <div className="flex flex-col gap-2 mt-2 w-full">
          <input
            onChange={(e) => setInput(e.target.files[0])}
            type="file"
            accept="application/pdf"
            className="w-full p-2 px-3 outline-none text-base rounded-lg border border-gray-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 transition-all min-w-0"
            required
          />
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <button
              type="button"
              className="px-4 py-2 w-full sm:w-auto bg-gradient-to-r from-blue-400 to-violet-400 text-white font-semibold rounded-lg shadow hover:from-blue-500 hover:to-violet-500 transition-colors"
              onClick={() => document.querySelector("input[type=file]").click()}
            >
              Add File
            </button>
            <button
              type="button"
              className="px-4 py-2 w-full sm:w-auto bg-gradient-to-r from-gray-200 to-violet-200 text-violet-700 font-semibold rounded-lg shadow hover:from-gray-300 hover:to-violet-300 transition-colors"
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
        <p className="text-xs text-gray-500 font-light mt-1">
          Supports PDF Resume Only
        </p>

        <button
          disabled={loading}
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-bold px-4 py-2 rounded-full shadow-lg hover:scale-105 hover:from-blue-600 hover:to-violet-600 transition-all duration-300 mt-6"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
          ) : (
            <FileText className="inline mr-2 text-violet-200" />
          )}
          Review Resume
        </button>
      </form>
      {/* Right Section */}
      <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-lg flex flex-col border border-violet-300 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-6 h-6 text-violet-500 drop-shadow" />
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-violet-500 to-pink-400">
            Analysis Result
          </h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-base flex flex-col items-center gap-5 text-violet-400">
              <FileText className="w-10 h-10 text-violet-300" />
              <p className="text-center">
                Upload a PDF and click{" "}
                <span className="font-bold text-violet-500">Review Resume</span>
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

export default ReviewResume;
