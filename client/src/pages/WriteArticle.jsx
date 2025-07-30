import { Edit, Sparkle } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { downloadMarkdownAsPDF as downloadMarkdown } from "../utils/downloadMarkdownAsPDF";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200+ words)" },
  ];

  // --- State with localStorage persistence ---
  const [selectedLength, setSelectedLength] = useState(
    () =>
      JSON.parse(localStorage.getItem("writeArticle.selectedLength")) ||
      articleLength[0]
  );
  const [input, setInput] = useState(
    () => localStorage.getItem("writeArticle.input") || ""
  );
  const [content, setContent] = useState(
    () => localStorage.getItem("writeArticle.content") || ""
  );
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    localStorage.setItem("writeArticle.input", input);
  }, [input]);

  useEffect(() => {
    localStorage.setItem(
      "writeArticle.selectedLength",
      JSON.stringify(selectedLength)
    );
  }, [selectedLength]);

  useEffect(() => {
    // Persist the generated content as well
    localStorage.setItem("writeArticle.content", content);
  }, [content]);

  // --- Mutation for generating an article ---
  const { mutate: generateArticle, isPending: loading } = useMutation({
    mutationFn: async ({ prompt, length }) => {
      const token = await getToken();
      if (!token) throw new Error("Authentication token not found.");
      const { data } = await axios.post(
        "/api/ai/generate-article",
        { prompt, length },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!data.success) {
        throw new Error(data.message || "Failed to generate article.");
      }
      return data.content;
    },
    onSuccess: (newContent) => {
      setContent(newContent);
      toast.success("Article generated successfully!");
      setInput(""); // Clear input on success
      queryClient.invalidateQueries({ queryKey: ["userCreations"] });
    },
    onError: (error) => {
      toast.error(error.message || "An unexpected error occurred.");
    },
  });

  const onSubmitHandeler = (e) => {
    e.preventDefault();
    const prompt = `A beautiful ${selectedLength.text} article with a heading about: ${input}`;
    generateArticle({ prompt, length: selectedLength.length });
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-8 flex flex-col sm:flex-row items-start gap-y-8 sm:gap-x-8 text-slate-700 bg-gradient-to-br from-indigo-100 to-pink-100 min-h-screen">
      {/* Left Section */}
      <form
        onSubmit={onSubmitHandeler}
        className="w-full sm:max-w-lg p-4 sm:p-6 bg-white rounded-2xl shadow-xl border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkle className="w-7 h-7 text-pink-500 drop-shadow" />
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-fuchsia-500 to-pink-500">
            Article Configuration
          </h1>
        </div>
        <p className="mt-6 text-sm font-medium">Article Topic</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-base rounded-lg border border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all"
          placeholder="Enter article topic..."
          required
        />
        <p className="mt-4 text-sm font-medium">Article Length</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {articleLength.map((item, index) => (
            <span
              key={index}
              className={`text-xs px-4 py-1 border-2 rounded-full cursor-pointer font-semibold transition-all duration-200 ${
                selectedLength.text === item.text
                  ? "bg-gradient-to-r from-pink-200 to-indigo-200 border-pink-400 text-pink-700 shadow"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setSelectedLength(item)}
            >
              {item.text}
            </span>
          ))}
        </div>
        <br />
        <div className="w-full flex flex-wrap items-center gap-2 mt-6">
          <button
            disabled={loading}
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold px-4 py-2 rounded-full shadow-lg hover:scale-105 hover:from-fuchsia-500 hover:to-pink-600 transition-all duration-300"
          >
            {loading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
            ) : (
              <Edit className="inline mr-2" />
            )}
            Generate Article
          </button>
          {content && (
            <>
              <button
                className="px-4 py-2 text-xs font-semibold rounded-full bg-gradient-to-r from-pink-400 to-indigo-400 text-white shadow-md hover:from-fuchsia-500 hover:to-pink-600 transition-all duration-200 focus:outline-none"
                onClick={() => {
                  navigator.clipboard.writeText(content);
                  toast.success("Copied to clipboard!");
                }}
                type="button"
              >
                Copy
              </button>
              <button
                className="px-4 py-2 text-xs font-semibold rounded-full bg-gradient-to-r from-indigo-400 to-pink-400 text-white shadow-md hover:from-fuchsia-500 hover:to-pink-600 transition-all duration-200 focus:outline-none"
                onClick={() => downloadMarkdown(content)}
                type="button"
              >
                Download PDF
              </button>
            </>
          )}
        </div>
      </form>

      {/* Right Section - Enhanced UI */}
      <div className="w-full sm:max-w-lg p-4 sm:p-6 rounded-2xl shadow-2xl flex flex-col border border-gray-100 min-h-96 max-h-[80vh] bg-white/60 backdrop-blur-lg bg-gradient-to-br from-white/70 via-pink-100/60 to-indigo-100/60 relative mt-8 sm:mt-0">
        <div className="flex items-center gap-3 mb-2">
          <Edit className="w-6 h-6 text-pink-500 drop-shadow" />
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-fuchsia-500 to-pink-500">
            Generated Article
          </h1>
        </div>
        <div className="relative flex-1 flex flex-col min-h-0">
          {content ? (
            <div className="mt-3 flex-1 min-h-0 overflow-y-auto px-2 sm:px-3 py-2 rounded-xl bg-white/70 shadow-inner border border-pink-100 max-h-[40vh] sm:max-h-[420px] text-[1.08rem] leading-7">
              <Markdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="font-bold text-xl mb-2 mt-2" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="font-bold text-lg mb-2 mt-2" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="font-semibold text-base mb-2 mt-2"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => <p className="mb-3" {...props} />,
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc ml-6 mb-3" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal ml-6 mb-3" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="mb-1" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-bold" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="italic" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-pink-300 pl-4 italic text-gray-500 my-2"
                      {...props}
                    />
                  ),
                  code: ({ node, ...props }) => (
                    <code
                      className="bg-gray-100 px-1 rounded text-pink-600"
                      {...props}
                    />
                  ),
                }}
              >
                {content}
              </Markdown>
            </div>
          ) : (
            <div className="flex-1 flex justify-center items-center">
              <div className="text-base flex flex-col items-center gap-5 text-gray-400">
                <Edit className="w-10 h-10 text-indigo-300" />
                <p className="text-center">
                  Enter a topic and click{" "}
                  <span className="font-bold text-pink-400">
                    Generate Article
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteArticle;
