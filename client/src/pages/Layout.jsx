import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { X, Menu } from "lucide-react";
import Sidebar from "./../components/Sidebar";
import { useUser, SignIn } from "@clerk/clerk-react";
const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();

  return user ? (
    <div className="flex flex-col items-start justify-start h-screen">
      <nav className="w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200">
        <img
          src={assets.logo}
          alt="busyBot Logo"
          onClick={() => navigate("/")}
          className="w-32 sm:w-44 cursor-pointer"
        />
        {sidebar ? (
          <X
            className="w-6 h-6 text-gray-600 sm:hidden"
            onClick={() => setSidebar(false)}
          />
        ) : (
          <Menu
            className="w-6 h-6 text-gray-600 sm:hidden"
            onClick={() => setSidebar(true)}
          />
        )}
      </nav>
      <div className="flex-1 w-full flex h-[calc(100vh-64px)]">
        <Sidebar sidebar={sidebar} setsidebar={setSidebar} />
        <div className="flex-1 p-4 bg-[#f4f7fb]">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <SignIn />
    </div>
  );
};

export default Layout;
