import React from "react";
import { assets } from "./../assets/assets";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-50 pt-24 pb-8 text-slate-500">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between w-full gap-14 border-b border-slate-900/10 pb-12">
          <div className="max-w-sm">
            <img className="h-9" src={assets.logo} alt="busyBot Logo" />
            <p className="mt-6 text-sm leading-6">
              Empowering creators with intelligent AI tools to streamline
              workflows and unlock new possibilities. Join us in shaping the
              future of digital content.
            </p>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row items-start md:justify-end gap-14">
            <div>
              <h2 className="font-semibold mb-5 text-slate-800">Company</h2>
              <ul className="text-sm space-y-3">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 transition-colors"
                  >
                    About us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 transition-colors"
                  >
                    Contact us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div className="max-w-md">
              <h2 className="font-semibold text-slate-800 mb-5">
                Subscribe to our newsletter
              </h2>
              <div className="text-sm space-y-3">
                <p>
                  The latest news, articles, and resources, sent to your inbox
                  weekly.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    className="border border-slate-900/10 placeholder-slate-400 focus:ring-2 focus:ring-purple-500/50 outline-none w-full h-10 rounded-md px-3 text-sm"
                    type="email"
                    placeholder="Enter your email"
                  />
                  <button className="bg-gradient-to-r from-pink-500 to-purple-600 px-5 h-10 text-white font-semibold rounded-md hover:opacity-90 transition-opacity">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="pt-8 text-center text-sm">
          Copyright © {new Date().getFullYear()}{" "}
          <a
            href="#"
            className="font-medium hover:text-purple-600 transition-colors"
          >
            busyBot
          </a>
          . All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
