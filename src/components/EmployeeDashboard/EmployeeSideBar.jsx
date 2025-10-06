import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../Store/authContext";
import {
  FaCalendarAlt,

  FaMoneyBillAlt,

  FaUserCircle,
  FaHome,
  FaSignOutAlt,
  FaChevronRight,
  FaChevronDown,
  FaBriefcase,
  FaFileAlt,
  FaChartBar,
} from "react-icons/fa";
import { MdDashboard, MdPayments, MdSettings } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";

const EmployeeSideBar = () => {
  const [sideBar, setSideBar] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const { user, logout } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const departmentData = {
    HR: {
      color: "bg-purple-600",
      icon: <RiTeamFill className="text-xl" />,
    },
    IT: {
      color: "bg-blue-600",
      icon: <FaBriefcase className="text-xl" />,
    },
    Finance: {
      color: "bg-green-600",
      icon: <MdPayments className="text-xl" />,
    },
    default: {
      color: "bg-indigo-600",
      icon: <FaUserCircle className="text-xl" />,
    },
  };

  const department = user?.department || "default";
  const deptInfo = departmentData[department] || departmentData.default;

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const toggleMenu = () => {
    setSideBar(!sideBar);
  };

  const toggleSubMenu = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/employee-dashboard",
      icon: <MdDashboard className="text-xl" />,
      exact: true,
    },
    {
      name: "My Profile",
      path: `/employee-dashboard/profile/${user?._id}`,
      icon: <FaUserCircle className="text-xl" />,
      subItems: [
        {
          name: "Personal Info",
          path: `/employee-dashboard/profile/${user?._id}/personal`,
        },
        {
          name: "Documents",
          path: `/employee-dashboard/profile/${user?._id}/documents`,
        },
      ],
    },
    {
      name: "Leaves",
      path: `/employee-dashboard/leaves/${user?._id}`,
      icon: <FaCalendarAlt className="text-xl" />,
      subItems: [
        { name: "Apply Leave", path: `/employee-dashboard/add-new-leave` },
        {
          name: "Leave History",
          path: `/employee-dashboard/leaves/${user?._id}`,
        },
      ],
    },
    {
      name: "Salary",
      path: `/employee-dashboard/salary/${user?._id}`,
      icon: <FaMoneyBillAlt className="text-xl" />,
      subItems: [
        {
          name: "Payslips",
          path: `/employee-dashboard/salary/${user?._id}`,
        },
        // {
        //   name: "Tax Documents",
        //   path: `/employee-dashboard/salary/${user?._id}/tax`,
        // },
      ],
    },
    {
      name: "Performance",
      path: `/employee-dashboard/performance`,
      icon: <FaChartBar className="text-xl" />,
    },
    {
      name: "Documents",
      path: `/employee-dashboard/documents`,
      icon: <FaFileAlt className="text-xl" />,
    },
  ];

  if (loading) {
    return (
      <div className="w-60 h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50 ">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-md bg-white shadow-lg focus:outline-none"
        >
          <div
            className={`w-6 h-0.5 bg-gray-700 mb-1.5 transition-all ${
              sideBar ? "rotate-45 translate-y-2" : ""
            }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-gray-700 mb-1.5 transition-all ${
              sideBar ? "opacity-0" : ""
            }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-gray-700 transition-all ${
              sideBar ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></div>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sideBar ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-70 `}
      >
        <div className="flex flex-col h-full bg-gradient-to-b from-teal-700 to-teal-900 text-white shadow-xl">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-full ${deptInfo.color} flex items-center justify-center text-white`}
              >
                {deptInfo.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold">Employee Portal</h2>
                <p className="text-xs text-gray-400">
                  {user?.department || "Employee"}
                </p>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 flex items-center space-x-3 border-b border-gray-700">
            <div className="relative">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
                  <FaUserCircle className="text-2xl text-white" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
            </div>
            <div>
              <h3 className="font-medium">{user?.name || "Employee"}</h3>
              <p className="text-xs text-gray-400">
                {user?.designation || "Staff"}
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  {item.subItems ? (
                    <>
                      <button
                        onClick={() => toggleSubMenu(item.name)}
                        className={`w-full flex items-center cursor-pointer justify-between p-3 rounded-lg transition-colors ${
                          location.pathname.startsWith(item.path)
                            ? "bg-indigo-700"
                            : "hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-indigo-300">{item.icon}</span>
                          <span>{item.name}</span>
                        </div>
                        {expandedMenu === item.name ? (
                          <FaChevronDown className="text-xs" />
                        ) : (
                          <FaChevronRight className="text-xs" />
                        )}
                      </button>
                      {expandedMenu === item.name && (
                        <ul className="ml-8 mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.name}>
                              <NavLink
                                to={subItem.path}
                                className={({ isActive }) =>
                                  `block p-2 rounded-lg transition-colors cursor-pointer ${
                                    isActive
                                      ? "bg-indigo-800 text-white"
                                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                  }`
                                }
                              >
                                <span className="flex items-center space-x-2">
                                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                                  <span>{subItem.name}</span>
                                </span>
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <NavLink
                      to={item.path}
                      end={item.exact}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                          isActive ? "bg-indigo-700" : "hover:bg-gray-700 "
                        }`
                      }
                    >
                      <span className="text-indigo-300">{item.icon}</span>
                      <span>{item.name}</span>
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-700">
            <NavLink
              to="/employee-dashboard/settings"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-700 cursor-pointer"
                }`
              }
            >
              <MdSettings className="text-xl text-gray-400" />
              <span>Settings</span>
            </NavLink>
            <button
              onClick={logout}
              className="w-full cursor-pointer flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:bg-gray-700 transition-colors"
            >
              <FaSignOutAlt className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sideBar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
};

export default EmployeeSideBar;
