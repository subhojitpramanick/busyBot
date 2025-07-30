import React from "react";
import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  Eraser,
  House,
  Scissors,
  SquarePen,
  Hash,
  Image,
  FileText,
  Users,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users },
];

const Sidebar = ({ sidebar, setsidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  //   console.log("Plan value:", user.publicMetadata?.plan);

  return (
    <div
      className={`w-64 bg-slate-50 border-r border-slate-200 flex flex-col max-sm:absolute top-0 bottom-0 z-50 ${
        sidebar ? "translate-x-0" : "max-sm:-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      {user ? (
        <>
          <div className="flex-grow flex flex-col">
            <div className="text-center py-8">
              <div className="p-1 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 inline-block">
                <img
                  src={user.imageUrl}
                  alt="User profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-slate-50"
                  onClick={openUserProfile}
                />
              </div>
              <h1 className="mt-3 text-lg font-semibold text-slate-800">
                {user.fullName}
              </h1>
            </div>

            <nav className="flex-grow px-4">
              <ul className="space-y-2">
                {navItems.map(({ to, label, Icon }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={to === "/ai"}
                      onClick={() => setsidebar(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md"
                            : "text-slate-600 hover:bg-slate-200 hover:text-purple-700"
                        }`
                      }
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="w-full border-t border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={openUserProfile}
              >
                <img
                  src={user.imageUrl}
                  className="w-9 h-9 rounded-full object-cover"
                  alt="User profile thumbnail"
                />
                <div className="gap-1 flex flex-col">
                  <h1 className="text-sm font-semibold text-slate-700 group-hover:text-purple-700 transition-colors">
                    {user.fullName}
                  </h1>
                  <p className="text-xs text-slate-500">
                    <Protect
                      plan="premium"
                      fallback={
                        <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                          Free
                        </span>
                      }
                    >
                      <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-0.5 rounded-full ">
                        Premium
                      </span>
                    </Protect>
                  </p>
                </div>
              </div>
              <LogOut
                onClick={() => signOut()}
                className="w-5 h-5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                aria-label="Sign out"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-slate-400">
          Loading...
        </div>
      )}
    </div>
  );
};

export default Sidebar;
