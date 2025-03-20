import React from "react";
import { useAuth } from "../../Store/authContext";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const {user , logout} = useAuth();
  const Navigate  = useNavigate();
  return (
    <div className="lg:w-[calc(100vw-240px)] lg:ml-60 w-screen">
      {" "}
      <div className="flex h-14 bg-teal-600 w-full justify-between items-center ">
        <p className="text-white font-medium flex md:gap-10 lg:ml-4 md:ml-16 ml-14 gap-2">
          <span >Welcome</span> {user?.name}
        </p>
       
      <div className="flex gap-2">
        <button className="bg-teal-900 p-2 font-bold font-sans text-white rounded-sm  h-10 my-auto hover:bg-teal-950 cursor-pointer"
        onClick={()=>Navigate("/signup")}
        >login</button>
      <button
          className="bg-teal-900 p-2 font-bold font-sans text-white rounded-sm mr-2 h-10 my-auto hover:bg-teal-950 cursor-pointer"
          onClick={({logout} ,()=>Navigate("/login"))}
        >
          Logout
        </button>
      </div>
      </div>
      
    </div>
  );
};

export default NavBar;
