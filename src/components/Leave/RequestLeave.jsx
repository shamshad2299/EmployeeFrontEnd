import React, { useEffect, useState } from "react";
import {
  fetchDataResponce,
  leaveColumns,
} from "../../pages/utils/EmployeeHelper";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../Store/authContext";
const RequestLeave = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leavApplied, setLeaveApplied] = useState({
    userId: user?._id,
  });

  useEffect(() => {
    if (user) {
      setLeaveApplied({ userId: user._id });
    }
  }, [user]);

  console.log(leavApplied);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveApplied((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  //fetch department of employee

  //navigate to employee dashboard after requesting a leave
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const responce = await axios.post(
        "http://localhost:3000/api/leave/applied",
        leavApplied,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (responce?.data?.success) {
        setLeaveApplied(responce?.data?.data);
        navigate("/employee-dashboard/leaves/:id");
        toast.success("leave applied");
      }
      if (responce?.data?.error) {
        toast.error(responce?.data?.message);
      }
    } catch (error) {
      console.log(error);
    }

    // backend API call
  };

  return (
    <div className="bg-white lg:w-175  xl:w-240  md:w-170 md:mx-auto h-132 p-4 mx-10 my-10 shadow-md rounded-md overflow-x-hidden">
      <h3 className="text-2xl font-bold ">Request for a leave</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col w-full gap-2 pt-4">
          <label htmlFor="leave">Leave type</label>
          <select
            name="leaveType"
            id="leave"
            className="py-2 border-2 border-slate-300 rounded-md"
            onChange={handleChange}
          >
            <option value="">Select Leave Type</option>
            <option>sick leave</option>
            <option>casual leave</option>
            <option>anual leave</option>
          </select>
        </div>

        <div className="flex  sm:flex-row flex-col w-full pt-4 gap-4">
          <div className="flex flex-col w-full">
            {" "}
            <label htmlFor="from">from date</label>
            <input
              onChange={handleChange}
              type="date"
              name="startDate"
              className="border-2 border-slate-300 mt-2 py-2 rounded-md"
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="to">to date</label>
            <input
              onChange={handleChange}
              type="date"
              name="endDate"
              className="border-2 border-slate-300 mt-2 py-2 rounded-md"
            />
          </div>
        </div>
        <div className="flex flex-col pt-4">
          <label htmlFor="description">Description</label>
          <textarea
            onChange={handleChange}
            name="description"
            id="description"
            placeholder="Reason for leave"
            className="w-full border-2 border-slate-300  rounded-md mt-2 sm:h-40 h-16 row-10"
          ></textarea>
        </div>
        <button className="w-full bg-teal-600 mt-8 py-2 font-bold text-white cursor-pointer rounded-md">
          Add Leave
        </button>
      </form>
    </div>
  );
};

export default RequestLeave;
