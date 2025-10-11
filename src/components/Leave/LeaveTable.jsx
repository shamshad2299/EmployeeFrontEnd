import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { LeaveButton, leaveStatus } from "../../pages/utils/LeaveHelper";
import axios from "axios";
import { AllApi } from "../../CommonApiContainer/AllApi";
import Loader from "../Loader";
import { AccessDenied } from "./RequestLeave";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Icons
import {
  FaSearch,
  FaFilter,
  FaSync,
  FaEye,
  FaUser,
  FaCalendarAlt,
  FaBuilding,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEllipsisV,
  FaIdCard,
  FaListUl,
} from "react-icons/fa";
import LoadingSpinner from "../common/LoadingSpinner";

const LeaveTable = () => {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [mobileView, setMobileView] = useState(false);
  const user = JSON.parse(localStorage.getItem("userId"));
  const navigate = useNavigate();

  // Fixed enhanced columns - properly map the original columns
  const enhancedColumns = leaveStatus.map((col) => {
    if (col.selector === "status") {
      return {
        ...col,
        cell: (row) => (
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold text-center ${
              row.status === "accepted"
                ? "bg-green-100 text-green-800"
                : row.status === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {row.status}
          </div>
        ),
      };
    }

    if (col.selector === "action") {
      return {
        ...col,
        cell: (row) => <LeaveButton id={row.id} />,
      };
    }

    return col;
  });

  const fetchDataResponse = async () => {
    try {
      setLoading(true);
      const response = await axios.get(AllApi.getAllLeaves.url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        let sno = 1;
        const finalData = response.data.leaves.map((leave) => ({
          id: leave._id,
          sno: sno++,
          employeeId: leave.employeeId.employeeId,
          name: leave.employeeId.userId.name,
          leave: leave.leaveType,
          department: leave.employeeId.department.dep_name,
          days:
            Math.ceil(
              (new Date(leave.endDate) - new Date(leave.startDate)) /
                (1000 * 60 * 60 * 24)
            ) + 1,
          status: leave.status,
          startDate: leave.startDate,
          endDate: leave.endDate,
          reason: leave.description,
          action: (
            <LeaveButton
              id={leave._id}
              className="bg-red-700 pr-20"
            ></LeaveButton>
          ),
          // Remove action from here as it's handled in columns
        }));

        setData(finalData);
        setFilterData(finalData);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataResponse();
  }, []);

  // Handle window resize for mobile view
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = data.filter(
      (leave) =>
        leave.employeeId.toLowerCase().includes(value) ||
        leave.name.toLowerCase().includes(value) ||
        leave.department.toLowerCase().includes(value)
    );

    applyStatusFilter(filtered, activeFilter);
  };

  const handleFilterByStatus = (status) => {
    setActiveFilter(status);
    applyStatusFilter(data, status);
  };

  const applyStatusFilter = (dataToFilter, status) => {
    if (status === "all") {
      setFilterData(dataToFilter);
    } else {
      const filtered = dataToFilter.filter((leave) =>
        leave.status.toLowerCase().includes(status.toLowerCase())
      );
      setFilterData(filtered);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <FaCheckCircle className="text-green-500" />;
      case "rejected":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  // Handle view button click for mobile cards
  const handleViewClick = (leaveId) => {
    navigate(`/admin/leaves/${leaveId}`);
  };

  // Handle status update from mobile cards
  const handleStatusUpdate = async (leaveId, status) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${AllApi.changeLeaveStatus.url}/${leaveId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response?.data?.success) {
        toast.success(response.data.message);
        // Refresh the data
        fetchDataResponse();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // Mobile Card Component with action buttons
  const LeaveCard = ({ leave }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-4 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FaUser className="text-blue-600 text-lg" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{leave.name}</h3>
            <p className="text-gray-600 text-sm flex items-center gap-1">
              <FaIdCard className="text-gray-400" />
              {leave.employeeId}
            </p>
          </div>
        </div>
        <div
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${getStatusColor(
            leave.status
          )}`}
        >
          {getStatusIcon(leave.status)}
          <span className="text-sm font-semibold capitalize">
            {leave.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-purple-500" />
          <div>
            <p className="text-xs text-gray-500">Leave Type</p>
            <p className="font-semibold text-gray-800 capitalize">
              {leave.leave}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FaBuilding className="text-orange-500" />
          <div>
            <p className="text-xs text-gray-500">Department</p>
            <p className="font-semibold text-gray-800">{leave.department}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FaListUl className="text-green-500" />
          <div>
            <p className="text-xs text-gray-500">Duration</p>
            <p className="font-semibold text-gray-800">{leave.days} days</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-blue-500" />
          <div>
            <p className="text-xs text-gray-500">Dates</p>
            <p className="font-semibold text-gray-800 text-xs">
              {new Date(leave.startDate).toLocaleDateString()} -{" "}
              {new Date(leave.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {leave.reason && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">Reason</p>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
            {leave.reason}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500">ID: {leave.id.slice(-8)}</span>
        <div className="flex gap-2">
          <button
            onClick={() => handleViewClick(leave.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center gap-2"
          >
            <FaEye />
            View
          </button>

          {/* Quick Actions for Pending Leaves */}
          {leave.status === "pending" && user.role === "ADMIN" && (
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusUpdate(leave.id, "accepted")}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center gap-1"
                disabled={loading}
              >
                <FaCheckCircle />
                <span className="hidden sm:inline">Approve</span>
              </button>
              <button
                onClick={() => handleStatusUpdate(leave.id, "rejected")}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center gap-1"
                disabled={loading}
              >
                <FaTimesCircle />
                <span className="hidden sm:inline">Reject</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f8fafc",
        borderBottomWidth: "2px",
        borderBottomColor: "#e2e8f0",
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
    headCells: {
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#374151",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    rows: {
      style: {
        minHeight: "60px",
        "&:not(:last-of-type)": {
          borderBottomWidth: "1px",
          borderBottomColor: "#f1f5f9",
        },
        "&:hover": {
          backgroundColor: "#f8fafc",
        },
      },
    },
  };

  if (user.role !== "EMPLOYEE" && user.role !== "ADMIN") {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Leave Management
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage and track all employee leave requests in one place with
            comprehensive oversight and control.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Leaves</p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaListUl className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.filter((item) => item.status === "pending").length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaClock className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Approved</p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.filter((item) => item.status === "accepted").length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Rejected</p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.filter((item) => item.status === "rejected").length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <FaTimesCircle className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md w-full">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Search by employee ID, name, or department..."
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleFilterByStatus("all")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeFilter === "all"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaFilter />
                All Leaves
              </button>
              <button
                onClick={() => handleFilterByStatus("pending")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeFilter === "pending"
                    ? "bg-yellow-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaClock />
                Pending
              </button>
              <button
                onClick={() => handleFilterByStatus("accepted")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeFilter === "accepted"
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaCheckCircle />
                Approved
              </button>
              <button
                onClick={() => handleFilterByStatus("rejected")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeFilter === "rejected"
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaTimesCircle />
                Rejected
              </button>

              {/* Refresh Button */}
              <button
                onClick={fetchDataResponse}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
              >
                <FaSync />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Data Table / Cards */}
        {loading ? (
          <div className=" bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <LoadingSpinner
                text="Loading All Leave details Please wait..."
                size="lg"
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {mobileView ? (
              // Mobile Card View
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Leave Requests ({filterData.length})
                  </h3>
                  <span className="text-sm text-gray-500">
                    Showing {filterData.length} of {data.length} leaves
                  </span>
                </div>

                {filterData.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaSearch className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      No leaves found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filterData.map((leave) => (
                      <LeaveCard key={leave.id} leave={leave} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Desktop Table View - Fixed data display
              <DataTable
                columns={enhancedColumns}
                data={filterData}
                customStyles={customStyles}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50]}
                highlightOnHover
                pointerOnHover
                noDataComponent={
                  <div className="text-center py-12">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaSearch className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      No leaves found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveTable;
