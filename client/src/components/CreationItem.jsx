import React from "react";
import Markdown from "react-markdown";

// A helper to get themed colors for the badges
const typeColors = {
  "blog-title": "from-pink-500 to-purple-600",
  article: "from-sky-400 to-indigo-500",
  image: "from-amber-400 to-orange-500",
  default: "from-slate-400 to-slate-500",
};

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = React.useState(false);
  const badgeColor = typeColors[item.type] || typeColors.default;

  return (
    <div
      className="p-4 max-w-5xl bg-white border border-slate-200 rounded-xl shadow-sm cursor-pointer hover:shadow-lg transition-all duration-300"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-grow">
          <h2 className="font-semibold text-slate-800">{item.prompt}</h2>
          <p className="text-xs text-slate-500 mt-1">
            {item.type} - {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
        <div
          className={`text-xs font-semibold text-white px-3 py-1 rounded-full whitespace-nowrap bg-gradient-to-r ${badgeColor}`}
        >
          {item.type}
        </div>
      </div>
      {expanded && (
        <div className="mt-4 border-t border-slate-200 pt-4">
          {item.type === "image" ? (
            <div>
              <img
                src={item.content}
                alt="Generated content"
                className="mt-3 w-full max-w-md rounded-lg"
              />
            </div>
          ) : (
            <div className="reset-tw">
              <Markdown>{item.content}</Markdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;
