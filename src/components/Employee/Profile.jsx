import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AllApi } from "../../CommonApiContainer/AllApi";
import { useAuth } from "../../Store/authContext";
import Loader from "../Loader";
import {
  FaUserTie,
  FaIdBadge,
  FaVenusMars,
  FaBirthdayCake,
  FaBuilding,
  FaHeart,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBriefcase,
  FaGraduationCap,
  FaUserShield,
  FaMoneyBillWave,
  FaClock,
  FaUsers,
  FaLaptopCode,
  FaChartLine,
  FaEdit,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaGlobe,
  FaFilePdf,
  FaRegFilePdf,
  FaFileWord,
  FaFileExcel,
} from "react-icons/fa";
import { MdEmail, MdWorkHistory, MdFamilyRestroom } from "react-icons/md";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FiDownload } from "react-icons/fi";
import ProgressBar from "./ProgressBar";
import LoadingSpinner from "../common/LoadingSpinner";

const Profile = () => {
  const [employee, setEmployees] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const user = JSON.parse(localStorage.getItem("userId"));

  const ViewEmployees = async () => {
    try {
      setLoading(true);
      const getData = await axios.get(`${AllApi.viewEmployee.url}/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (getData?.data?.success) {
        setEmployees(getData.data.employee);
      } else if (getData.data.error) {
        toast.error(getData.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to load employee data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ViewEmployees();
  }, []);
  // Department data with icons and descriptions
  const departmentData = {
    HR: {
      icon: <FaUsers className="text-3xl text-purple-600" />,
      description:
        "Human Resources manages talent acquisition, employee relations, and organizational development.",
      color: "bg-purple-100",
      bgColor: "from-purple-100 to-purple-50",
    },
    IT: {
      icon: <FaLaptopCode className="text-3xl text-blue-600" />,
      description:
        "Information Technology drives innovation through technology solutions and infrastructure.",
      color: "bg-blue-100",
      bgColor: "from-blue-100 to-blue-50",
    },
    Finance: {
      icon: <FaMoneyBillWave className="text-3xl text-green-600" />,
      description:
        "Finance oversees financial planning, analysis, and accounting operations.",
      color: "bg-green-100",
      bgColor: "from-green-100 to-green-50",
    },
    Marketing: {
      icon: <FaChartLine className="text-3xl text-red-600" />,
      description:
        "Marketing develops strategies to promote products and engage customers.",
      color: "bg-red-100",
      bgColor: "from-red-100 to-red-50",
    },
    default: {
      icon: <FaBuilding className="text-3xl text-gray-600" />,
      description:
        "This department drives core operations and business functions.",
      color: "bg-gray-100",
      bgColor: "from-gray-100 to-gray-50",
    },
  };

  const department = employee?.department?.dep_name || "default";
  const deptInfo = departmentData[department] || departmentData.default;

 if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <LoadingSpinner text="Checking your profile Please wait..." size="lg" />
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <FaUserShield className="text-yellow-500 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Employee Profile Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            You are not registered as an employee in our system.
          </p>
       <div className="flex gap-3">
           <button
            className=" cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => (window.location.href = "/employee-dashboard")}
          >
            Return to Dashboard
          </button>
          <button
            className=" cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => (window.location.href = "/employee-dashboard/request")}
          >
           Request for Employee
          </button>
       </div>
        </div>
      </div>
    );
  }

  // Calculate completion percentage for profile
  const calculateProfileCompletion = () => {
    const fields = [
      employee?.userId?.name,
      employee?.gender,
      employee?.dob,
      employee?.contactNumber,
      employee?.address,
      employee?.designation,
      employee?.education,
      employee?.skills?.length > 0,
    ];
    const filledFields = fields.filter((field) => field).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Profile Card */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
              <div className="relative">
                {/* Cover Photo */}
                <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

                {/* Profile Picture */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="relative w-24 h-24 border-4 border-white rounded-full bg-white shadow-md">
                    {employee?.userId?.profilePic ? (
                      <img
                        className="w-full h-full rounded-full object-cover"
                        src={`http://localhost:5000/uploads/${employee.userId.profilePic}`}
                        alt="Profile"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                        <FaUserTie className="text-3xl text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-16 pb-6 px-6 text-center">
                <div className="flex justify-center items-center">
                  <h1 className="text-xl font-bold text-gray-800 mr-2">
                    {employee?.userId?.name}
                  </h1>
                  <RiVerifiedBadgeFill className="text-blue-500" />
                </div>
                <p className="text-blue-600">
                  {employee?.designation || "Employee"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {employee?.department?.dep_name || "Department"}
                </p>

                {/* Profile Completion */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Profile Completion</span>
                    <span>{profileCompletion}%</span>
                  </div>
                  <ProgressBar
                    percentage={profileCompletion}
                    color="bg-blue-500"
                  />
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-4 mt-6">
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    <FaLinkedin className="text-xl" />
                  </a>
                  <a href="#" className="text-gray-800 hover:text-gray-600">
                    <FaGithub className="text-xl" />
                  </a>
                  <a href="#" className="text-blue-400 hover:text-blue-600">
                    <FaTwitter className="text-xl" />
                  </a>
                  <a href="#" className="text-indigo-600 hover:text-indigo-800">
                    <FaGlobe className="text-xl" />
                  </a>
                </div>

                {/* Download Profile */}
                <button className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  <FiDownload className="mr-2" />
                  Download Profile
                </button>
              </div>
            </div>
          </div>

          {/* Department Card & Stats */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {/* Department Card */}
            <div
              className={`bg-gradient-to-r ${deptInfo.bgColor} rounded-xl shadow-md p-6 flex flex-col h-full`}
            >
              <div className="flex items-start mb-4">
                <div className="mr-4">{deptInfo.icon}</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {employee?.department?.dep_name || "Department"}
                  </h2>
                  <p className="text-gray-600 mt-1">{deptInfo.description}</p>
                </div>
              </div>
              <div className="mt-auto grid grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-gray-700">
                    <FaBuilding className="mr-2" />
                    <span>Floor 3, West Wing</span>
                  </div>
                </div>
                <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-gray-700">
                    <FaPhone className="mr-2" />
                    <span>
                      Ext: {employee?.department?.phoneExtension || "X-456"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <FaClock className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Joined On</p>
                  <p className="font-semibold">
                    {employee?.createdAt
                      ? new Date(employee.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <MdWorkHistory className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Experience</p>
                  <p className="font-semibold">
                    {employee?.experience || "0"} yrs
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
                <div className="p-3 bg-purple-100 rounded-full mr-4">
                  <FaIdBadge className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Employee ID</p>
                  <p className="font-semibold">
                    {employee?.employeeId || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("personal")}
                className={`px-6 py-3 border-b-2 font-medium ${
                  activeTab === "personal"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Personal
              </button>
              <button
                onClick={() => setActiveTab("professional")}
                className={`px-6 py-3 border-b-2 font-medium ${
                  activeTab === "professional"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Professional
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`px-6 py-3 border-b-2 font-medium ${
                  activeTab === "documents"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab("performance")}
                className={`px-6 py-3 border-b-2 font-medium ${
                  activeTab === "performance"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Performance
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "personal" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Details */}
                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <FaUserTie className="mr-2 text-blue-600" />
                      Personal Details
                    </h3>
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <div className="w-1/3 text-gray-500 flex items-center">
                        <FaIdBadge className="mr-2" />
                        Full Name
                      </div>
                      <div className="w-2/3 font-medium">
                        {employee?.userId?.name}
                      </div>
                    </div>
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <div className="w-1/3 text-gray-500 flex items-center">
                        <FaVenusMars className="mr-2" />
                        Gender
                      </div>
                      <div className="w-2/3 font-medium">
                        {employee?.gender || "N/A"}
                      </div>
                    </div>
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <div className="w-1/3 text-gray-500 flex items-center">
                        <FaBirthdayCake className="mr-2" />
                        Date of Birth
                      </div>
                      <div className="w-2/3 font-medium">
                        {employee?.dob
                          ? new Date(employee.dob).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </div>
                    <div className="flex items-center py-2">
                      <div className="w-1/3 text-gray-500 flex items-center">
                        <MdFamilyRestroom className="mr-2" />
                        Marital Status
                      </div>
                      <div className="w-2/3 font-medium">
                        {employee?.maritalStatus || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <FaEnvelope className="mr-2 text-blue-600" />
                      Contact Information
                    </h3>
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <div className="w-1/3 text-gray-500 flex items-center">
                        <MdEmail className="mr-2" />
                        Email
                      </div>
                      <div className="w-2/3 font-medium">
                        {employee?.userId?.email || "N/A"}
                      </div>
                    </div>
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <div className="w-1/3 text-gray-500 flex items-center">
                        <FaPhone className="mr-2" />
                        Phone
                      </div>
                      <div className="w-2/3 font-medium">
                        {employee?.contactNumber || "N/A"}
                      </div>
                    </div>
                    <div className="flex items-center py-2">
                      <div className="w-1/3 text-gray-500 flex items-center">
                        <FaMapMarkerAlt className="mr-2" />
                        Address
                      </div>
                      <div className="w-2/3 font-medium">
                        {employee?.address || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "professional" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Employment Details */}
                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <FaBriefcase className="mr-2 text-blue-600" />
                      Employment Details
                    </h3>
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <div className="w-1/3 text-gray-500">Designation</div>
                      <div className="w-2/3 font-medium">
                        {employee?.designation || "N/A"}
                      </div>
                    </div>
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <div className="w-1/3 text-gray-500">Department</div>
                      <div className="w-2/3 font-medium">
                        {employee?.department?.dep_name || "N/A"}
                      </div>
                    </div>
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <div className="w-1/3 text-gray-500">Joining Date</div>
                      <div className="w-2/3 font-medium">
                        {employee?.joiningDate
                          ? new Date(employee.joiningDate).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </div>
                    <div className="flex items-center py-2">
                      <div className="w-1/3 text-gray-500">Employee Type</div>
                      <div className="w-2/3 font-medium">Full-time</div>
                    </div>
                  </div>
                </div>

                {/* Education & Skills */}
                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <FaGraduationCap className="mr-2 text-blue-600" />
                      Education & Skills
                    </h3>
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <div className="w-1/3 text-gray-500">
                        Highest Education
                      </div>
                      <div className="w-2/3 font-medium">
                        {employee?.education || "N/A"}
                      </div>
                    </div>
                    <div className="py-2">
                      <div className="text-gray-500 mb-2">Skills</div>
                      <div className="flex flex-wrap gap-2">
                        {employee?.skills?.length > 0 ? (
                          employee.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">
                            No skills listed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  My Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Document Cards */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-start mb-3">
                      <FaRegFilePdf className="text-red-500 text-2xl mr-3" />
                      <div>
                        <h4 className="font-medium">Employment Contract</h4>
                        <p className="text-xs text-gray-500">
                          Uploaded: 15 Jan 2023
                        </p>
                      </div>
                    </div>
                    <button className="w-full mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm flex items-center justify-center">
                      <FiDownload className="mr-1" /> Download
                    </button>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-start mb-3">
                      <FaFileWord className="text-blue-500 text-2xl mr-3" />
                      <div>
                        <h4 className="font-medium">Offer Letter</h4>
                        <p className="text-xs text-gray-500">
                          Uploaded: 10 Jan 2023
                        </p>
                      </div>
                    </div>
                    <button className="w-full mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm flex items-center justify-center">
                      <FiDownload className="mr-1" /> Download
                    </button>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-start mb-3">
                      <FaFileExcel className="text-green-500 text-2xl mr-3" />
                      <div>
                        <h4 className="font-medium">Tax Forms</h4>
                        <p className="text-xs text-gray-500">
                          Uploaded: 5 Mar 2023
                        </p>
                      </div>
                    </div>
                    <button className="w-full mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm flex items-center justify-center">
                      <FiDownload className="mr-1" /> Download
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "performance" && (
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Performance Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Performance Metrics */}
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium mb-3">Productivity</h4>
                    <ProgressBar percentage={85} color="bg-green-500" />
                    <p className="text-sm text-gray-500 mt-2">
                      Above company average (75%)
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium mb-3">Quality of Work</h4>
                    <ProgressBar percentage={92} color="bg-blue-500" />
                    <p className="text-sm text-gray-500 mt-2">
                      Excellent performance
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium mb-3">Team Collaboration</h4>
                    <ProgressBar percentage={78} color="bg-purple-500" />
                    <p className="text-sm text-gray-500 mt-2">
                      Good team player
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium mb-3">Initiative</h4>
                    <ProgressBar percentage={65} color="bg-yellow-500" />
                    <p className="text-sm text-gray-500 mt-2">
                      Room for improvement
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
