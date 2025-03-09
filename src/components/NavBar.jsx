import React from "react";
import { useAuth } from "../Store/authContext";
import { Outlet } from "react-router-dom";

const NavBar = () => {
  const { user, logout } = useAuth();
  return (
    <div className="lg:w-[calc(100vw-240px)] lg:ml-60 w-screen ">
      <div className="flex h-14 bg-teal-600 lg:w-[calc(100vw-240px)] justify-between items-center w-screen">
        <p className="text-white font-medium flex gap-10 lg:pl-4 pl-20">
          <span>Welcome</span> {user.name}
        </p>
        <button
          className="bg-teal-900 p-2 font-bold font-sans text-white rounded-sm mr-10 h-10 my-auto hover:bg-teal-950 cursor-pointer"
          onClick={logout}
        >
          Logout
        </button>
      </div>
      <div className=" lg:w-[calc(100vw-240px)]  bg-slate-100 h-screen w-screen">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default NavBar;
