import React, { useEffect, useState } from "react";
import {
  FaBuilding,
  FaCheckCircle,
  FaFileAlt,
  FaHourglassHalf,
  FaMoneyBillAlt,
  FaTimesCircle,
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaSync,
} from "react-icons/fa";
import SummaryCard from "./Departments/SummaryCard";
import axios from "axios";
import { AllApi } from "../CommonApiContainer/AllApi";
import Loader from "./Loader";

const AdminSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [dateRange, setDateRange] = useState({
  //   start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  //   end: new Date(),
  // });
  const [refreshing, setRefreshing] = useState(false);

   const today = new Date().toISOString().split("T")[0];

    const [dateRange, setDateRange] = useState({
      start: today,
      end: today,
    });

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${AllApi.dashborad.url}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSummary(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getData();
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <Loader />
      </div>
    );
  }


  const handleDateChange = (key, value) => {
    setDateRange((prev) => ({
      ...prev,
      [key]: value || today, // if cleared, reset to today
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <FaChartLine className="text-blue-500" />
              Real-time insights and analytics for your organization
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Date Range Picker */}
            <div className="flex gap-2 max-md:flex-col bg-white rounded-xl p-3 shadow-sm border border-gray-200">
              {/* Start Date */}
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-400" />
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => handleDateChange("start", e.target.value)}
                  className="bg-transparent border-none text-sm focus:outline-none text-gray-700"
                />
              </div> 
             <span className="ml-10 bg-gray-200 w-fit p-2 rounded-full text-black/50">to</span>
              {/* End Date */}
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-400" />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => handleDateChange("end", e.target.value)}
                  className="bg-transparent border-none text-sm focus:outline-none text-gray-700"
                />
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl shadow-sm border border-gray-200 transition-all duration-200 flex items-center gap-2 justify-center disabled:opacity-50"
            >
              <FaSync className={`${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            msg={"Total Employees"}
            color={"from-blue-500 to-blue-600"}
            number={summary?.totalEmployees}
            trend={12}
            icon={<FaUsers className="text-white" />}
            description="Active workforce"
            gradient={true}
          />
          <SummaryCard
            msg={"Total Departments"}
            color={"from-green-500 to-green-600"}
            number={summary?.totalDepartments}
            trend={5}
            icon={<FaBuilding className="text-white" />}
            description="Organizational units"
            gradient={true}
          />
          <SummaryCard
            msg={"Monthly Budget"}
            color={"from-purple-500 to-purple-600"}
            rup={"₹"}
            number={summary?.totalSalary}
            trend={-2}
            icon={<FaMoneyBillAlt className="text-white" />}
            description="Salary allocation"
            gradient={true}
          />
        </div>
      </div>

      {/* Leave Management Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaFileAlt className="text-blue-600" />
                </div>
                Leave Management
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Track and manage employee leave requests
              </p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                This Month
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard
              msg={"Leave Applied"}
              color={"from-blue-400 to-blue-500"}
              number={summary?.leaveSummary?.appliedFor}
              icon={<FaFileAlt className="text-white" />}
              description="Total requests"
              gradient={true}
              compact={true}
            />
            <SummaryCard
              msg={"Pending Approval"}
              color={"from-yellow-400 to-yellow-500"}
              number={summary?.leaveSummary?.pending}
              icon={<FaHourglassHalf className="text-white" />}
              description="Awaiting review"
              gradient={true}
              compact={true}
            />
            <SummaryCard
              msg={"Approved"}
              color={"from-green-400 to-green-500"}
              number={summary?.leaveSummary?.approved}
              icon={<FaCheckCircle className="text-white" />}
              description="Confirmed leaves"
              gradient={true}
              compact={true}
            />
            <SummaryCard
              msg={"Rejected"}
              color={"from-red-400 to-red-500"}
              number={summary?.leaveSummary?.rejected}
              icon={<FaTimesCircle className="text-white" />}
              description="Declined requests"
              gradient={true}
              compact={true}
            />
          </div>

          {/* Leave Statistics Bar */}
          <div className="mt-8 bg-gray-50 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">
                Leave Distribution
              </h3>
              <span className="text-sm text-gray-500">Real-time</span>
            </div>
            <div className="flex h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="bg-green-500 transition-all duration-500"
                style={{
                  width: `${
                    ((summary?.leaveSummary?.approved || 0) /
                      (summary?.leaveSummary?.appliedFor || 1)) *
                    100
                  }%`,
                }}
              ></div>
              <div
                className="bg-yellow-500 transition-all duration-500"
                style={{
                  width: `${
                    ((summary?.leaveSummary?.pending || 0) /
                      (summary?.leaveSummary?.appliedFor || 1)) *
                    100
                  }%`,
                }}
              ></div>
              <div
                className="bg-red-500 transition-all duration-500"
                style={{
                  width: `${
                    ((summary?.leaveSummary?.rejected || 0) /
                      (summary?.leaveSummary?.appliedFor || 1)) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>Approved: {summary?.leaveSummary?.approved || 0}</span>
              <span>Pending: {summary?.leaveSummary?.pending || 0}</span>
              <span>Rejected: {summary?.leaveSummary?.rejected || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-white hover:bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200 transition-all duration-200 text-left group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg group-hover:scale-110 transition-transform">
              <FaCheckCircle className="text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Approve Leaves</h3>
              <p className="text-sm text-gray-600">Manage pending requests</p>
            </div>
          </div>
        </button>

        <button className="bg-white hover:bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200 transition-all duration-200 text-left group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
              <FaUsers className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Team Overview</h3>
              <p className="text-sm text-gray-600">View team analytics</p>
            </div>
          </div>
        </button>

        <button className="bg-white hover:bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200 transition-all duration-200 text-left group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform">
              <FaChartLine className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Reports</h3>
              <p className="text-sm text-gray-600">Generate insights</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AdminSummary;
