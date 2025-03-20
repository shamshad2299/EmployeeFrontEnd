import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../Store/authContext";
import { FaCalendarAlt, FaCogs, FaMoneyBillAlt, FaTachometerAlt, FaUsers } from "react-icons/fa";

const EmployeeSideBar = () => {
  const [sideBar, setSideBar] = useState(false);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    if (user) {
      
      setLoading(false); // Stop loading once `user` is available
    } else {
      console.log("User ID not available yet");
    }
  }, [user]);

  const changeMenu = () => {
    setSideBar(!sideBar);
  };

 

  return (
    <div>
      <div className="lg:hidden block w-8 h-8 absolute m-1 top-2 left-2 cursor-pointer z-4" onClick={changeMenu}>
        <div className="bg-black w-8 h-1 m-1"></div>
        <div className="bg-black w-8 h-1 m-1"></div>
        <div className="bg-black w-8 h-1 m-1"></div>
      </div>
      <div className={`lg:w-60 lg:block ${sideBar ? "block" : "hidden"} z-3 fixed h-screen`}>
        <h3 className="bg-teal-600 p-2 font-bold text-white font-serif w-60 text-center h-14">Employee MS</h3>
        <div className="admin-sidebar flex w-60 min-h-screen bg-yellow-400">
          <ul className="bg-cyan-950 text-white flex flex-col gap-4 w-full font-bold font-serif rounded-sm">
            <NavLink className={({ isActive }) => `${isActive ? "bg-teal-600" : ""} p-2 ml-2 mr-2 rounded mt-1`} to="/employee-dashboard">
              <FaTachometerAlt /> Dashboard
            </NavLink>
            <NavLink className={({ isActive }) => `${isActive ? "bg-teal-600" : ""} p-2 ml-2 mr-2 rounded mt-1`} to={`/employee-dashboard/profile/${user?._id}`}>
              <FaUsers /> My Profile
            </NavLink>
            <NavLink className={({ isActive }) => `${isActive ? "bg-teal-600" : ""} p-2 ml-2 mr-2 rounded mt-1`} to={`/employee-dashboard/leaves/${user?._id}`}>
              <FaCalendarAlt /> Leaves
            </NavLink>
            <NavLink className={({ isActive }) => `${isActive ? "bg-teal-600" : ""} p-2 ml-2 mr-2 rounded mt-1`} to={`/employee-dashboard/salary/${user?._id}`}>
              <FaMoneyBillAlt /> Salary
            </NavLink>
            <NavLink className={({ isActive }) => `${isActive ? "bg-teal-600" : ""} p-2 ml-2 mr-2 rounded mt-1`} to="/employee-dashboard/setting">
              <FaCogs /> Setting
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSideBar;
