// Helper to download markdown as PDF using jsPDF and html2canvas

import jsPDF from "jspdf";
import React from "react";
import { createRoot } from "react-dom/client";
import Markdown from "react-markdown";
import { marked } from "marked";

export async function downloadMarkdownAsPDF(
  markdownContent,
  filename = "article.pdf"
) {
  // Convert markdown to HTML and inject custom CSS for better structure
  const customCSS = `
    <style>
      body { color: #222; font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.7; font-size: 16px; }
      h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; color: #2d1e6b; }
      h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; color: #a21caf; }
      h3 { font-size: 1.2em; font-weight: bold; margin: 0.8em 0; color: #be185d; }
      ul, ol { margin: 0 0 1em 2em; }
      ul { list-style-type: disc; }
      ol { list-style-type: decimal; }
      li { margin-bottom: 0.3em; }
      p { margin: 0 0 1em 0; }
      strong { font-weight: bold; }
      em { font-style: italic; }
      blockquote { border-left: 4px solid #f472b6; padding-left: 1em; color: #555; margin: 1em 0; font-style: italic; }
      code { background: #f3f4f6; color: #be185d; padding: 2px 4px; border-radius: 4px; font-size: 0.95em; }
    </style>
  `;
  const html = customCSS + marked.parse(markdownContent);
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  tempDiv.style.padding = "24px";
  tempDiv.style.background = "#fff";
  tempDiv.style.width = "800px";
  tempDiv.style.maxWidth = "100%";
  document.body.appendChild(tempDiv);

  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  await pdf.html(tempDiv, {
    margin: [20, 20, 20, 20],
    autoPaging: "text",
    html2canvas: { scale: 1.2 },
    callback: function (doc) {
      doc.save(filename);
      document.body.removeChild(tempDiv);
    },
  });
}
// removed extra closing brace
