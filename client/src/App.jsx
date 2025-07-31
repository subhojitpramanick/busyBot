import React from "react";
import { Routes, Route, useLocation } from "react-router-dom"; // Import useLocation
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import WriteArticle from "./pages/WriteArticle";
import BlogTitles from "./pages/BlogTitles";
import GenerateImages from "./pages/GenerateImages";
import RemoveObject from "./pages/RemoveObject";
import RemoveBackground from "./pages/RemoveBackground";
import ReviewResume from "./pages/ReviewResume";
import Community from "./pages/Community";
import WatchDemo from "./pages/WatchDemo";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

const App = () => {
  const location = useLocation();
  return (
    <div>
      <Toaster />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/watch-demo" element={<WatchDemo />} />
          <Route path="/ai" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="write-article" element={<WriteArticle />} />
            <Route path="blog-titles" element={<BlogTitles />} />
            <Route path="generate-images" element={<GenerateImages />} />
            <Route path="remove-object" element={<RemoveObject />} />
            <Route path="remove-background" element={<RemoveBackground />} />
            <Route path="review-resume" element={<ReviewResume />} />
            <Route path="community" element={<Community />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;
