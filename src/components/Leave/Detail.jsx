import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AllApi } from "../../CommonApiContainer/AllApi";
import Loader from "../Loader";

// Icons (using react-icons)
import { 
  FaUser, 
  FaIdBadge, 
  FaCalendarAlt, 
  FaBuilding, 
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from "react-icons/fa";
import LoadingSpinner from "../common/LoadingSpinner";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const ViewLeaves = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${AllApi.viewLeaves.url}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response?.data?.success) {
        setLeaves(response?.data?.leaves);
      } else if (response?.data?.error) {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load leave details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ViewLeaves();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      setActionLoading(true);
      const response = await axios.put(
        `${AllApi.changeLeaveStatus.url}/${id}`, 
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response?.data?.success) {
        setLeaves(prev => ({ ...prev, status }));
        toast.success(response.data.message);
      } else if (response?.data?.error) {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted": return "bg-green-100 text-green-800 border-green-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted": return <FaCheckCircle className="text-green-500" />;
      case "rejected": return <FaTimesCircle className="text-red-500" />;
      default: return <FaClock className="text-yellow-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

 if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <LoadingSpinner text="Viewing Employee's leave Please wait..." size="lg" />
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/admin/leaves")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <FaArrowLeft />
            <span>Back to Leaves</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Leave Application Details</h1>
            <p className="text-gray-600 mt-2">Review and manage employee leave request</p>
          </div>
          
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(leaves?.status)}`}>
            {getStatusIcon(leaves?.status)}
            <span className="font-semibold capitalize">{leaves?.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Employee Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              {/* Profile Image */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 p-1">
                    <img
                      className="w-full h-full rounded-full object-cover border-4 border-white"
                      src={`https://employee-backend-last.vercel.app/${leaves?.employeeId?.userId?.profilePic}`}
                      alt={leaves?.employeeId?.userId?.name}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(leaves?.employeeId?.userId?.name || 'Employee')}&background=6366f1&color=fff&size=128`;
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                    <div className="bg-green-500 rounded-full p-1">
                      <div className="bg-green-400 rounded-full w-4 h-4"></div>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 text-center">
                  {leaves?.employeeId?.userId?.name}
                </h2>
                <p className="text-gray-600 text-center">{leaves?.employeeId?.department?.dep_name}</p>
              </div>

              {/* Employee Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FaIdBadge className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Employee ID</p>
                    <p className="font-semibold text-gray-800">{leaves?.employeeId?.employeeId}</p>
                  </div>
                </div>

                {leaves?.employeeId?.userId?.email && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <FaEnvelope className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-800">{leaves?.employeeId?.userId?.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <FaBuilding className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-semibold text-gray-800">{leaves?.employeeId?.department?.dep_name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leave Details Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Leave Application Information</h2>
              </div>

              <div className="p-6">
                {/* Leave Type & Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FaFileAlt className="text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800">Leave Type</h3>
                    </div>
                    <p className="text-lg font-bold text-blue-700 capitalize">{leaves?.leaveType}</p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <FaCalendarAlt className="text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800">Duration</h3>
                    </div>
                    <p className="text-lg font-bold text-green-700">
                      {calculateDays(leaves?.startDate, leaves?.endDate)} days
                    </p>
                  </div>
                </div>

                {/* Date Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="text-sm text-gray-600 mb-1">Start Date</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {leaves?.startDate ? formatDate(leaves.startDate) : 'N/A'}
                    </p>
                  </div>

                  <div className="border-l-4 border-green-400 pl-4">
                    <p className="text-sm text-gray-600 mb-1">End Date</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {leaves?.endDate ? formatDate(leaves.endDate) : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Reason */}
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaFileAlt className="text-gray-600" />
                    Reason for Leave
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {leaves?.description || "No reason provided"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {leaves?.status === "pending" && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Take Action</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => changeStatus(leaves?._id, "accepted")}
                        disabled={actionLoading}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                      >
                        <FaCheckCircle />
                        {actionLoading ? "Processing..." : "Approve Leave"}
                      </button>
                      
                      <button
                        onClick={() => changeStatus(leaves?._id, "rejected")}
                        disabled={actionLoading}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                      >
                        <FaTimesCircle />
                        {actionLoading ? "Processing..." : "Reject Leave"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Application Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Application Submitted</p>
                    <p className="text-sm text-gray-600">Employee submitted leave request</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    leaves?.status !== "pending" ? "bg-green-500" : "bg-gray-300"
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Under Review</p>
                    <p className="text-sm text-gray-600">Currently being reviewed by management</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    leaves?.status === "accepted" ? "bg-green-500" : 
                    leaves?.status === "rejected" ? "bg-red-500" : "bg-gray-300"
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 capitalize">
                      {leaves?.status === "accepted" ? "Approved" : 
                       leaves?.status === "rejected" ? "Rejected" : "Decision Pending"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {leaves?.status === "accepted" ? "Leave request has been approved" : 
                       leaves?.status === "rejected" ? "Leave request has been rejected" : 
                       "Waiting for final decision"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;