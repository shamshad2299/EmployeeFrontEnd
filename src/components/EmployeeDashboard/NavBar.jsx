import React, {  useState } from "react";
import { useAuth } from "../../Store/authContext";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import {  
  FaSearch, 
  FaUserCircle, 
  FaCog,
  FaSignOutAlt,
  FaChevronDown
} from "react-icons/fa";
import { useNotice } from "../../helper/Notice";



const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const {showNotice , NoticeComponent} = useNotice();
  

  // Department colors
  const departmentColors = {
    HR: "bg-purple-600",
    IT: "bg-blue-600",
    Finance: "bg-green-600",
    Marketing: "bg-red-600",
    default: "bg-indigo-600"
  };

  const department = user?.department || 'default';
  const deptColor = departmentColors[department] || departmentColors.default;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  
  return (
    <div className={`fixed lg:w-[calc(100%-240px)] w-full ml-0 lg:ml-60 z-10 `}>
      {NoticeComponent}
      <div className="flex items-center justify-between h-16 px-4 bg-white shadow-md">
        {/* Left Section - Breadcrumbs */}
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {location.pathname.split('/').pop() || 'Dashboard'}
          </h2>
        </div>

        {/* Right Section - User Controls */}
        <div className="flex items-center space-x-4 sm:mr-10 cursor-pointer">
          {/* Search Bar */}
          {/* <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-40"
            />
          </div> */}

          {/* Notifications */}
          {/* <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <FaBell className="text-gray-600" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button> */}

          {/* Messages */}
          {/* <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <FaEnvelope className="text-gray-600" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button> */}

          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={toggleDropdown}
              className="flex items-center space-x-2 focus:outline-none curp"
            >
              <div className={`w-8 h-8 rounded-full ${deptColor} flex items-center justify-center text-white`}>
                {user?.profilePic ? (
                  <img 
                    src={user.profilePic} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-xl" />
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.department || 'Employee'}</p>
              </div>
              <FaChevronDown className={`text-xs text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <NavLink
                  to="/employee-dashboard/profile"
                  className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FaUserCircle className="mr-2" />
                  My Profile
                </NavLink>
                <NavLink
                onClick={()=>showNotice("settings" , 200)}
                  to="/employee-dashboard/settings"
                  className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FaCog className="mr-2" />
                  Settings
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search (hidden on desktop) */}
      <div className="md:hidden bg-gray-50 px-4 py-2">
        <div className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default NavBar;