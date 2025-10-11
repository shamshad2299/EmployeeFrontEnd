import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../Store/authContext";
import { AllApi } from "../../CommonApiContainer/AllApi";
import Loader from "../Loader";

// React Icons
import { 
  FaCalendarAlt, 
  FaFileAlt, 
  FaBriefcase, 
  FaPaperPlane,
  FaArrowLeft,
  FaCalendarCheck,
  FaHospital,
  FaUmbrellaBeach,
  FaBaby,
  FaMale,
  FaExclamationTriangle,
  FaClock,
  FaPhone,
  FaClipboardList
} from "react-icons/fa";
import { 
  GiFamilyHouse 
} from "react-icons/gi";
import LoadingSpinner from "../common/LoadingSpinner";

const RequestLeave = () => {
  const user = JSON.parse(localStorage.getItem("userId"));
  const { department } = useAuth();
  const navigate = useNavigate();
  const [leaveApplied, setLeaveApplied] = useState({
    userId: user?.id,
    leaveType: "",
    startDate: "",
    endDate: "",
    description: ""
  });
  
  const [dep, setDep] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calculatedDays, setCalculatedDays] = useState(0);
  const [errors, setErrors] = useState({});

  // Calculate days between dates
  useEffect(() => {
    if (leaveApplied.startDate && leaveApplied.endDate) {
      const start = new Date(leaveApplied.startDate);
      const end = new Date(leaveApplied.endDate);
      
      if (end >= start) {
        const timeDiff = end.getTime() - start.getTime();
        const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        setCalculatedDays(dayDiff);
      } else {
        setCalculatedDays(0);
      }
    }
  }, [leaveApplied.startDate, leaveApplied.endDate]);

  useEffect(() => {
    if (department) {
      setDep(department);
    }
  }, [department]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!leaveApplied.leaveType) newErrors.leaveType = "Leave type is required";
    if (!leaveApplied.startDate) newErrors.startDate = "Start date is required";
    if (!leaveApplied.endDate) newErrors.endDate = "End date is required";
    if (!leaveApplied.description) newErrors.description = "Description is required";
    
    if (leaveApplied.startDate && leaveApplied.endDate) {
      const start = new Date(leaveApplied.startDate);
      const end = new Date(leaveApplied.endDate);
      if (end < start) newErrors.endDate = "End date cannot be before start date";
    }

    if (leaveApplied.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveApplied((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${AllApi.leaveApplied.url}`,
        leaveApplied,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
       
      if (response?.data?.success) {
        setLeaveApplied({
          userId: user?.id,
          leaveType: "",
          startDate: "",
          endDate: "",
          description: ""
        });
        navigate(`/employee-dashboard/leaves/${response.data.data._id}`);
        toast.success("🎉 Leave application submitted successfully!");
      }
      if (response?.data?.error) {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit leave application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const leaveTypes = [
    { 
      value: "sick", 
      label: "Sick Leave", 
      icon: <FaHospital className="text-red-500 text-xl" />, 
      description: "For medical reasons and health issues",
      bgColor: "hover:border-red-300 hover:bg-red-50",
      selectedColor: "border-red-500 bg-red-50"
    },
    { 
      value: "casual", 
      label: "Casual Leave", 
      icon: <GiFamilyHouse className="text-green-500 text-xl" />, 
      description: "For personal work and emergencies",
      bgColor: "hover:border-green-300 hover:bg-green-50",
      selectedColor: "border-green-500 bg-green-50"
    },
    { 
      value: "annual", 
      label: "Annual Leave", 
      icon: <FaUmbrellaBeach className="text-blue-500 text-xl" />, 
      description: "Planned vacation and personal time",
      bgColor: "hover:border-blue-300 hover:bg-blue-50",
      selectedColor: "border-blue-500 bg-blue-50"
    },
    { 
      value: "maternity", 
      label: "Maternity Leave", 
      icon: <FaBaby className="text-pink-500 text-xl" />, 
      description: "For expecting mothers",
      bgColor: "hover:border-pink-300 hover:bg-pink-50",
      selectedColor: "border-pink-500 bg-pink-50"
    },
    { 
      value: "paternity", 
      label: "Paternity Leave", 
      icon: <FaMale className="text-indigo-500 text-xl" />, 
      description: "For new fathers",
      bgColor: "hover:border-indigo-300 hover:bg-indigo-50",
      selectedColor: "border-indigo-500 bg-indigo-50"
    },
    { 
      value: "emergency", 
      label: "Emergency Leave", 
      icon: <FaExclamationTriangle className="text-orange-500 text-xl" />, 
      description: "For urgent unforeseen circumstances",
      bgColor: "hover:border-orange-300 hover:bg-orange-50",
      selectedColor: "border-orange-500 bg-orange-50"
    }
  ];

 if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <LoadingSpinner text="Leave applied Please wait..." size="lg" />
        </div>
      </div>
    );
  }

if (user.role !== "EMPLOYEE" && user.role !== "ADMIN") {
  return <AccessDenied />;
}



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-teal-600 transition-colors duration-200 mb-4 mx-auto group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <div className="bg-white rounded-full p-4 shadow-lg inline-flex items-center justify-center mb-4">
            <FaCalendarCheck className="text-teal-600 text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Time Off</h1>
          <p className="text-gray-600 max-w-md mx-auto">Fill out the form below to submit your leave request for approval</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              {/* Leave Type Selection */}
              <div className="mb-8">
                <label className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                  <FaBriefcase className="mr-3 text-teal-600" />
                  Leave Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {leaveTypes.map((type) => (
                    <div
                      key={type.value}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        leaveApplied.leaveType === type.value
                          ? `${type.selectedColor} shadow-md scale-105`
                          : `border-gray-200 ${type.bgColor}`
                      }`}
                      onClick={() => setLeaveApplied(prev => ({
                        ...prev,
                        leaveType: type.value
                      }))}
                    >
                      <div className="flex items-center mb-2">
                        <span className="mr-3">{type.icon}</span>
                        <span className="font-semibold text-gray-800">{type.label}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                    </div>
                  ))}
                </div>
                {errors.leaveType && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <FaExclamationTriangle className="mr-2" />
                    {errors.leaveType}
                  </p>
                )}
              </div>

              {/* Date Selection */}
              <div className="mb-8">
                <label className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                  <FaCalendarAlt className="mr-3 text-teal-600" />
                  Date Range
                </label>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Start Date */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <div className="relative group">
                      <input
                        type="date"
                        name="startDate"
                        value={leaveApplied.startDate}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 pl-11 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 group-hover:border-teal-300 ${
                          errors.startDate ? "border-red-300" : "border-gray-200"
                        }`}
                      />
                      <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 group-hover:text-teal-500 transition-colors" />
                    </div>
                    {errors.startDate && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <FaExclamationTriangle className="mr-2" />
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  {/* End Date */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <div className="relative group">
                      <input
                        type="date"
                        name="endDate"
                        value={leaveApplied.endDate}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 pl-11 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 group-hover:border-teal-300 ${
                          errors.endDate ? "border-red-300" : "border-gray-200"
                        }`}
                      />
                      <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 group-hover:text-teal-500 transition-colors" />
                    </div>
                    {errors.endDate && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <FaExclamationTriangle className="mr-2" />
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Days Calculation */}
                {calculatedDays > 0 && (
                  <div className="mt-4 bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-xl p-4 transform transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaClock className="text-blue-500 mr-2" />
                        <span className="text-blue-800 font-semibold">Total Leave Days:</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600 bg-white px-3 py-1 rounded-lg shadow-sm">
                        {calculatedDays} day{calculatedDays > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <label className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                  <FaFileAlt className="mr-3 text-teal-600" />
                  Reason for Leave
                </label>
                <div className="relative group">
                  <textarea
                    name="description"
                    value={leaveApplied.description}
                    onChange={handleChange}
                    placeholder="Please provide a detailed reason for your leave request. Include any relevant information that will help with the approval process..."
                    rows="5"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none group-hover:border-teal-300 ${
                      errors.description ? "border-red-300" : "border-gray-200"
                    } ${leaveApplied.description.length > 450 ? 'border-orange-300' : ''}`}
                    maxLength="500"
                  />
                  <div className={`absolute bottom-3 right-3 text-sm transition-colors ${
                    leaveApplied.description.length > 450 ? 'text-orange-500 font-semibold' : 'text-gray-400'
                  }`}>
                    {leaveApplied.description.length}/500
                  </div>
                </div>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <FaExclamationTriangle className="mr-2" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
              >
                <FaPaperPlane className="mr-3 group-hover:translate-x-1 transition-transform" />
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </span>
                ) : (
                  "Submit Leave Request"
                )}
              </button>
            </form>
          </div>

          {/* Footer Note */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <FaClipboardList className="mr-2 text-teal-600" />
              Your leave request will be reviewed by your manager. You'll receive a notification once it's processed.
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <FaClipboardList className="text-blue-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-800">Review Process</h3>
            </div>
            <p className="text-sm text-gray-600">Typically processed within 24-48 hours by your line manager</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center mb-3">
              <div className="bg-orange-100 p-3 rounded-lg mr-4">
                <FaExclamationTriangle className="text-orange-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-800">Emergency Leave</h3>
            </div>
            <p className="text-sm text-gray-600">Contact your manager directly for urgent requests requiring immediate attention</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center mb-3">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <FaPhone className="text-green-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-800">Need Help?</h3>
            </div>
            <p className="text-sm text-gray-600">Contact HR department at hr@company.com or extension 1234</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestLeave;

export const AccessDenied = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center transform transition-all hover:scale-105">
        <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You do not have the required permissions to view this content.
        </p>
        <button
          onClick={() => window.history.back()}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};


