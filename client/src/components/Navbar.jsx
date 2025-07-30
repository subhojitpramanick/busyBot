import React from "react";
import { assets } from "./../assets/assets";
import arrowRight from "../assets/arrow_icon.svg";
import { useNavigate } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div className="fixed z-5 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:-px-20 xl:px-32 ">
      <img
        src={assets.logo}
        alt="logo"
        className="w-32 sm:w-44 cursor-pointer"
        onClick={() => {
          navigate("/");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
      {user ? (
        <div className="scale-120">
          <UserButton />
        </div>
      ) : (
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-violet-500 text-white px-4 py-2 rounded-md hover:from-pink-600 hover:to-violet-600 transition-colors duration-300 cursor-pointer"
          onClick={openSignIn}
        >
          Get Started
          <img src={arrowRight} alt="arrow right" className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
