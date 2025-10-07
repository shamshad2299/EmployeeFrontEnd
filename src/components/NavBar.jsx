import React from "react";
import { useAuth } from "../Store/authContext";
import { Outlet } from "react-router-dom";
import Loader from "./Loader";

const NavBar = () => {
  const { user, logout } = useAuth();

  return !user ? (
    <div className="w-full bg-gradient-to-br from-amber-50 to-yellow-100 flex justify-center items-center h-screen">
      <Loader />
    </div>
  ) : (
    <div className="lg:w-[calc(100vw-240px)] lg:ml-60 w-screen min-h-screen bg-gray-50 ">
      {/* Enhanced Header */}
      <div className="flex top-0 z-20 h-16 bg-gradient-to-r from-teal-600 to-emerald-600 lg:w-[calc(100vw-240px)] justify-between items-center w-screen px-6 shadow-lg fixed">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-lg">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-white/90 text-sm font-light">Welcome back</p>
            <p className="text-white font-semibold text-lg">{user.name}</p>
          </div>
        </div>

        <button
          className="bg-white/20 backdrop-blur-sm px-6 py-2.5 font-semibold font-sans text-white rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer flex items-center space-x-2"
          onClick={logout}
        >
          <span>Logout</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>

      {/* Enhanced Content Area */}
      <div className="lg:w-[calc(100vw-240px)] bg-gradient-to-br mt-15 from-gray-50 to-blue-50/30 min-h-[calc(100vh-4rem)] w-screen ">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-7rem)] ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
