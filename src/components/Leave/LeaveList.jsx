import React, { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { leaveColumns } from "../../pages/utils/EmployeeHelper";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  Bell,
  Users,
  AlertCircle,
  Briefcase,
  Menu,
  X,
  Eye,
  Trash2,
  FileText,
} from "lucide-react";
import { AllApi } from "../../CommonApiContainer/AllApi";
import Loader from "../../components/Loader";
import { AccessDenied } from "./RequestLeave";
import LoadingSpinner from "../common/LoadingSpinner";

const LeaveList = () => {
  const user = JSON.parse(localStorage.getItem("userId"));
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const navigate = useNavigate();
  const [leaveData, setLeaveData] = useState([]);
  const [leaveFilter, setLeaveFilter] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNotifications, setShowNotifications] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Enhanced leave columns with responsive design
  const enhancedLeaveColumns = useMemo(
    () => [
      {
        name: "S.No",
        selector: (row) => row.sno,
        sortable: true,
        width: "70px",
        maxWidth: "70px",
        cell: (row) => (
          <span className="text-sm font-medium text-gray-600 text-center block">
            {row.sno}
          </span>
        ),
      },
      {
        name: "Leave Type",
        selector: (row) => row.leave,
        sortable: true,
        minWidth: "120px",
        cell: (row) => (
          <span className="capitalize font-medium text-gray-800 text-sm">
            {row.leave}
          </span>
        ),
      },
      {
        name: "From Date",
        selector: (row) => row.from,
        sortable: true,
        minWidth: "110px",
        cell: (row) => (
          <div className="flex items-center gap-1">
            <Calendar size={12} className="text-gray-500 flex-shrink-0" />
            <span className="text-xs font-medium truncate">{row.from}</span>
          </div>
        ),
      },
      {
        name: "To Date",
        selector: (row) => row.to,
        sortable: true,
        minWidth: "110px",
        cell: (row) => (
          <div className="flex items-center gap-1">
            <Calendar size={12} className="text-gray-500 flex-shrink-0" />
            <span className="text-xs font-medium truncate">{row.to}</span>
          </div>
        ),
      },
      {
        name: "Description",
        selector: (row) => row.description,
        minWidth: "150px",
        cell: (row) => (
          <span
            className="text-xs text-gray-600 line-clamp-1 truncate"
            title={row.description}
          >
            {row.description}
          </span>
        ),
        omit: window.innerWidth < 1024,
      },
      {
        name: "Applied On",
        selector: (row) => row.applied,
        sortable: true,
        minWidth: "110px",
        cell: (row) => (
          <span className="text-xs text-gray-600">{row.applied}</span>
        ),
        omit: window.innerWidth < 768,
      },
      {
        name: "Status",
        selector: (row) => row.status,
        sortable: true,
        minWidth: "120px",
        cell: (row) => {
          const statusConfig = {
            approved: {
              color: "bg-green-100 text-green-800 border-green-200",
              icon: CheckCircle,
            },
            pending: {
              color: "bg-yellow-100 text-yellow-800 border-yellow-200",
              icon: Clock,
            },
            rejected: {
              color: "bg-red-100 text-red-800 border-red-200",
              icon: XCircle,
            },
          };

          const config =
            statusConfig[row.status.toLowerCase()] || statusConfig.pending;
          const IconComponent = config.icon;

          return (
            <div
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${config.color}`}
            >
              <IconComponent size={10} />
              <span className="text-xs font-medium capitalize hidden xs:inline">
                {row.status}
              </span>
              <span className="text-xs font-medium capitalize xs:hidden">
                {row.status.substring(0, 1)}
              </span>
            </div>
          );
        },
      },
      {
        name: "Actions",
        cell: (row) => (
          <div className="flex gap-1">
            <button
              onClick={() => handleViewDetails(row)}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-1"
            >
              <Eye size={12} />
              View
            </button>
            {row.status === "pending" && (
              <button
                onClick={() => handleCancelLeave(row)}
                className="px-2 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center gap-1"
              >
                <Trash2 size={12} />
                Cancel
              </button>
            )}
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        minWidth: "100px",
      },
    ],
    []
  );

  useEffect(() => {
    const getLeaves = async () => {
      if (!user) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <LoadingSpinner
                text="Loading allsalary Please wait..."
                size="lg"
              />
            </div>
          </div>
        );
      }
      const userId = user?.id;

      if (!userId) {
        setLoading(true);
        toast.error("userId is undefined");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${AllApi.getLeaveById.url}/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response?.data?.success) {
          let sno = 1;
          const finalLeave = response?.data?.data?.map((data) => ({
            id: data?._id,
            sno: sno++,
            leave: data?.leaveType,
            from: data?.startDate,
            to: data?.endDate,
            status: data?.status,
            description: data?.description,
            applied: new Date(data?.createdAt).toLocaleDateString(),
          }));

          setLeaveData(finalLeave);
          setLeaveFilter(finalLeave);
          calculateStats(finalLeave);
        } else {
          setLoading(true);
        }
      } catch (error) {
        console.error("Error fetching leaves:", error);
        toast.error("Failed to load leave data");
      } finally {
        setLoading(false);
      }
    };

    getLeaves();
  }, []);

  const calculateStats = (leaves) => {
    const stats = {
      total: leaves.length,
      approved: leaves.filter(
        (leave) => leave.status.toLowerCase() === "approved"
      ).length,
      pending: leaves.filter(
        (leave) => leave.status.toLowerCase() === "pending"
      ).length,
      rejected: leaves.filter(
        (leave) => leave.status.toLowerCase() === "rejected"
      ).length,
    };
    setStats(stats);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = leaveData.filter(
      (leave) =>
        leave.leave.toLowerCase().includes(value) ||
        leave.status.toLowerCase().includes(value) ||
        leave.description.toLowerCase().includes(value)
    );

    applyStatusFilter(filtered, statusFilter);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    applyStatusFilter(leaveData, status);
    setShowMobileFilters(false);
  };

  const applyStatusFilter = (data, status) => {
    if (status === "all") {
      setLeaveFilter(data);
    } else {
      const filtered = data.filter(
        (leave) => leave.status.toLowerCase() === status.toLowerCase()
      );
      setLeaveFilter(filtered);
    }
  };

  const handlenavigate = () => {
    navigate("/employee-dashboard/add-new-leave");
  };

  const handleViewDetails = (leave) => {
    toast.info(`Viewing details for ${leave.leave} leave`);
  };

  const handleCancelLeave = (leave) => {
    if (
      window.confirm(
        `Are you sure you want to cancel this ${leave.leave} leave?`
      )
    ) {
      toast.success("Leave cancellation request sent");
    }
  };

  const handleExport = () => {
    toast.info("Export feature coming soon!");
  };

  const getStatusConfig = (status) => {
    const config = {
      approved: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        bgColor: "bg-green-50",
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        bgColor: "bg-yellow-50",
      },
      rejected: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        bgColor: "bg-red-50",
      },
    };
    return config[status.toLowerCase()] || config.pending;
  };

  // Mobile Card Component
  const LeaveCard = ({ leave }) => {
    const statusConfig = getStatusConfig(leave.status);
    const IconComponent = statusConfig.icon;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText size={16} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm capitalize">
                {leave.leave}
              </h3>
              <p className="text-xs text-gray-500">#{leave.sno}</p>
            </div>
          </div>
          <div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${statusConfig.color}`}
          >
            <IconComponent size={12} />
            <span className="text-xs font-medium capitalize">
              {leave.status}
            </span>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">From</p>
              <p className="text-sm font-medium text-gray-900">{leave.from}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">To</p>
              <p className="text-sm font-medium text-gray-900">{leave.to}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        {leave.description && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Description</p>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-2 line-clamp-2">
              {leave.description}
            </p>
          </div>
        )}

        {/* Applied Date */}
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={14} className="text-gray-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Applied On</p>
            <p className="text-sm font-medium text-gray-900">{leave.applied}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-200">
          <button
            onClick={() => handleViewDetails(leave)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
          >
            <Eye size={14} />
            View Details
          </button>
          {leave.status === "pending" && (
            <button
              onClick={() => handleCancelLeave(leave)}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
            >
              <Trash2 size={14} />
              Cancel
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  const customStyles = {
    head: {
      style: {
        fontSize: "12px",
        fontWeight: "600",
        color: "#374151",
        backgroundColor: "#f9fafb",
        padding: "8px 4px",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#f9fafb",
        borderBottomWidth: "2px",
        borderBottomColor: "#e5e7eb",
        minHeight: "45px",
      },
    },
    rows: {
      style: {
        minHeight: "50px",
        fontSize: "12px",
        padding: "4px",
        "&:not(:last-of-type)": {
          borderBottomWidth: "1px",
          borderBottomColor: "#f3f4f6",
        },
        "&:hover": {
          backgroundColor: "#f8fafc",
        },
      },
    },
    cells: {
      style: {
        padding: "6px 4px",
        wordBreak: "break-word",
      },
    },
    pagination: {
      style: {
        backgroundColor: "#f9fafb",
        borderTopWidth: "1px",
        borderTopColor: "#e5e7eb",
        fontSize: "12px",
        padding: "8px",
      },
    },
  };

  if (user?.role !== "EMPLOYEE" && user?.role !== "ADMIN") {
    return <AccessDenied />;
  }

  const StatCard = ({ title, value, color, icon: Icon, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-4 sm:p-6 rounded-2xl ${color} border border-gray-200 shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600">
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
            {value}
          </p>
        </div>
        <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm">
          <Icon size={20} className="text-gray-700 sm:w-6 sm:h-6 w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 sm:p-4 lg:p-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Leave Management
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
              Manage your leave requests and track their status
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlenavigate}
            className="flex items-center gap-2 px-4 py-3 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-sm sm:text-base w-full lg:w-auto justify-center"
          >
            <Plus size={18} className="sm:w-5 sm:h-5 w-4 h-4" />
            Apply for Leave
          </motion.button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard
            title="Total Leaves"
            value={stats.total}
            color="bg-white"
            icon={BarChart3}
            delay={0.1}
          />
          <StatCard
            title="Approved"
            value={stats.approved}
            color="bg-green-50"
            icon={CheckCircle}
            delay={0.2}
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            color="bg-yellow-50"
            icon={Clock}
            delay={0.3}
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            color="bg-red-50"
            icon={XCircle}
            delay={0.4}
          />
        </div>
      </motion.div>

      {/* Important Notices Section */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Bell
                  size={18}
                  className="text-blue-600 sm:w-5 sm:h-5 w-4 h-4"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                    Important Notices
                  </h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0"
                  >
                    <XCircle size={16} className="sm:w-5 sm:h-5 w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <AlertCircle
                      size={14}
                      className="text-blue-500 flex-shrink-0 mt-0.5"
                    />
                    <span className="break-words">
                      Submit leave applications at least 3 days in advance
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle
                      size={14}
                      className="text-orange-500 flex-shrink-0 mt-0.5"
                    />
                    <span className="break-words">
                      Emergency leaves require immediate manager approval
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle
                      size={14}
                      className="text-purple-500 flex-shrink-0 mt-0.5"
                    />
                    <span className="break-words">
                      Check your remaining leave balance before applying
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle
                      size={14}
                      className="text-green-500 flex-shrink-0 mt-0.5"
                    />
                    <span className="break-words">
                      All leaves are subject to company policy approval
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium"
        >
          <Menu size={18} />
          {showMobileFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters and Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6 ${
          showMobileFilters ? "block" : "hidden lg:block"
        }`}
      >
        <div className="flex flex-col gap-4">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 sm:w-5 sm:h-5 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by leave type, status, or description..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "approved", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={`px-3 py-2 rounded-lg font-medium capitalize transition-all duration-200 text-xs sm:text-sm flex-1 sm:flex-none min-w-[70px] text-center ${
                    statusFilter === status
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Export Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-4 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium bg-white text-sm sm:text-base w-full sm:w-auto"
            >
              <Download size={16} className="sm:w-5 sm:h-5 w-4 h-4" />
              Export
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Data Section - Cards for Mobile, Table for Desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {loading ? (
          <div className=" bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <LoadingSpinner
                text="Loading Leave Detail Please wait..."
                size="md"
              />
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            {isMobile ? (
              <div className="p-4">
                {leaveFilter.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <Calendar size={32} className="mb-3 text-gray-300" />
                    <p className="text-base font-medium mb-2 text-center">
                      No leave records found
                    </p>
                    <p className="text-xs text-center">
                      Start by applying for your first leave
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leaveFilter.map((leave) => (
                      <LeaveCard key={leave.id} leave={leave} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Desktop Table View */
              <div className="overflow-x-auto">
                <DataTable
                  columns={enhancedLeaveColumns}
                  data={leaveFilter}
                  customStyles={customStyles}
                  pagination
                  paginationPerPage={8}
                  paginationRowsPerPageOptions={[5, 8, 10, 15]}
                  highlightOnHover
                  pointerOnHover
                  responsive
                  noDataComponent={
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                      <Calendar size={32} className="mb-3 text-gray-300" />
                      <p className="text-lg font-medium mb-2 text-center">
                        No leave records found
                      </p>
                      <p className="text-sm text-center">
                        Start by applying for your first leave
                      </p>
                    </div>
                  }
                />
              </div>
            )}

            {/* Summary Footer */}
            {leaveFilter.length > 0 && (
              <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                  Showing {leaveFilter.length} of {leaveData.length} leave
                  records
                  {statusFilter !== "all" && ` (Filtered by: ${statusFilter})`}
                </p>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Employment Opportunity Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 sm:p-6 text-white shadow-lg"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm flex-shrink-0">
              <Briefcase size={20} className="sm:w-6 sm:h-6 w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold mb-1 truncate">
                Join Our Growing Team!
              </h3>
              <p className="opacity-90 text-xs sm:text-sm line-clamp-2">
                Explore exciting career opportunities and become part of our
                success story
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button className="px-4 py-2 sm:px-6 sm:py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base text-center">
              View Open Positions
            </button>
            <button className="px-4 py-2 sm:px-6 sm:py-3 bg-transparent border border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors text-sm sm:text-base text-center">
              Refer a Friend
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LeaveList;
