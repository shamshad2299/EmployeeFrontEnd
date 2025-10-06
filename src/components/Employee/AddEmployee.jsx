import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AllApi } from "../../CommonApiContainer/AllApi";
import Loader from "../Loader";
import { useAuth } from "../../Store/authContext";
import {
  FiUser,
  FiMail,
  FiCreditCard,
  FiCalendar,
  FiUsers,
  FiHome,
  FiDollarSign,
  FiLock,
  FiUpload,
  FiPlus,
  FiArrowLeft,
  FiBriefcase,
} from "react-icons/fi";

const AddEmployee = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userId"));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeId: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    address: "",
    department: "",
    salary: "",
    password: "",
    role: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { department } = useAuth();
  const [deps, setDep] = useState([]);

  useEffect(() => {
    if (department) {
      setDep(department);
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: null }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        formDataObj.append(key, formData[key]);
      }
    });

    try {
      setLoading(true);
      const response = await axios.post(AllApi.addEmployee.url, formDataObj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
  

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => navigate("/admin/employee-dashboard"), 1500);
      } else {
        toast.error(response.data.message);
        setErrors(response.data.error || {});
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error(error.response?.data?.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/admin/employee-dashboard")}
            className="flex items-center text-teal-600 hover:text-teal-800 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            {user.role === "ADMIN" ? "Back to Employees" : "Back to Dashboard"}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-6 text-white">
            <div className="flex items-center">
              <FiUser className="text-3xl mr-4" />
              <div>
                <h2 className="text-2xl font-bold">
                  {" "}
                  {user.role === "ADMIN"
                    ? "Add New Employee"
                    : "Request for Employee "}
                </h2>
                <p className="text-teal-100">
                  Fill in the employee details below
                </p>
              </div>
            </div>
          </div>

          {/* Form section */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employee Name */}
                <div>
                  <label
                    htmlFor="name"
                    className=" text-sm font-medium text-gray-700 mb-1 flex items-center"
                  >
                    <FiUser className="mr-2 text-teal-600" />
                    Employee Name*
                  </label>
                  <div className="relative">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text"
                      placeholder="John Doe"
                      className={`block w-full px-4 py-3 pl-10 rounded-lg border ${
                        errors.name
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-teal-500"
                      } focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                </div>

                {/* Employee Email */}
                <div>
                  <label
                    htmlFor="email"
                    className=" text-sm font-medium text-gray-700 mb-1 flex items-center"
                  >
                    <FiMail className="mr-2 text-teal-600" />
                    Employee Email*
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="john@example.com"
                      className={`block w-full px-4 py-3 pl-10 rounded-lg border ${
                        errors.email
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-teal-500"
                      } focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Employee ID */}
                <div>
                  <label
                    htmlFor="employeeId"
                    className=" text-sm font-medium text-gray-700 mb-1 flex items-center"
                  >
                    <FiCreditCard className="mr-2 text-teal-600" />
                    Employee ID*
                  </label>
                  <div className="relative">
                    <input
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      type="text"
                      placeholder="EMP-001"
                      className={`block w-full px-4 py-3 pl-10 rounded-lg border ${
                        errors.employeeId
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-teal-500"
                      } focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                    />
                    {errors.employeeId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.employeeId}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label
                    htmlFor="dob"
                    className=" text-sm font-medium text-gray-700 mb-1 flex items-center"
                  >
                    <FiCalendar className="mr-2 text-teal-600" />
                    Date of Birth*
                  </label>
                  <div className="relative">
                    <input
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      className={` w-full px-4 py-3 pl-10 rounded-lg border ${
                        errors.dob
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-teal-500"
                      } focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                    />
                    {errors.dob && (
                      <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
                    )}
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label
                    htmlFor="gender"
                    className=" text-sm font-medium text-gray-700 mb-1 flex items-center"
                  >
                    <FiUser className="mr-2 text-teal-600" />
                    Gender*
                  </label>
                  <div className="relative">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={` w-full px-4 py-3 pl-10 rounded-lg border ${
                        errors.gender
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-teal-500"
                      } focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                    >
                      <option value="select">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.gender}
                      </p>
                    )}
                  </div>
                </div>

                {/* Marital Status */}
                <div>
                  <label
                    htmlFor="maritalStatus"
                    className=" text-sm font-medium text-gray-700 mb-1 flex items-center"
                  >
                    <FiUsers className="mr-2 text-teal-600" />
                    Marital Status
                  </label>
                  <div className="relative">
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleChange}
                      className=" w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-teal-500 focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all"
                    >
                      <option value="status">Select Status</option>
                      <option value="married">Married</option>
                      <option value="non-married">Not Married</option>
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className=" text-sm font-medium text-gray-700 mb-1 flex items-center"
                  >
                    <FiHome className="mr-2 text-teal-600" />
                    Address
                  </label>
                  <div className="relative">
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      type="text"
                      placeholder="123 Main St, City"
                      className="block w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-teal-500 focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all"
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label
                    htmlFor="department"
                    className=" text-sm font-medium text-gray-700 mb-1 flex items-center"
                  >
                    <FiBriefcase className="mr-2 text-teal-600" />
                    Department*
                  </label>
                  <div className="relative">
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 pl-10 rounded-lg border ${
                        errors.department
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-teal-500"
                      } focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                    >
                      <option value="select">Select Department</option>
                      {deps?.map((dep) => (
                        <option key={dep._id} value={dep._id}>
                          {dep.dep_name}
                        </option>
                      ))}
                    </select>
                    {errors.department && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.department}
                      </p>
                    )}
                  </div>
                </div>

                {/* Salary */}
                {user.role === "ADMIN" && (
                  <div>
                    <label
                      htmlFor="salary"
                      className=" text-sm font-medium text-gray-700 mb-1 flex items-center"
                    >
                      <FiDollarSign className="mr-2 text-teal-600" />
                      Salary*
                    </label>
                    <div className="relative">
                      <input
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        type="number"
                        placeholder="50000"
                        className={`block w-full px-4 py-3 pl-10 rounded-lg border ${
                          errors.salary
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:ring-teal-500"
                        } focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                      />
                      {errors.salary && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.salary}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className=" text-sm font-medium text-gray-700 mb-1 flex items-center"
                  >
                    <FiLock className="mr-2 text-teal-600" />
                    Password*
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type="password"
                      placeholder="••••••••"
                       autoComplete="current-password"
                      className={`block w-full px-4 py-3 pl-10 rounded-lg border ${
                        errors.password
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-teal-500"
                      } focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Must be 8+ characters with 1 uppercase, 1 lowercase, and 1
                      number
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label
                    htmlFor="role"
                    className=" text-sm font-medium text-gray-700 mb-1 flex items-center"
                  >
                    <FiUser className="mr-2 text-teal-600" />
                    Role*
                  </label>
                  <div className="relative">
                    {user.role === "ADMIN" ? (
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 pl-10 rounded-lg border ${
                          errors.role
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:ring-teal-500"
                        } focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                      >
                        <option value="">Select role</option>
                        <option value="ADMIN">Admin</option>
                        <option value="EMPLOYEE">Employee</option>
                        <option value="GENERAL">General</option>
                      </select>
                    ) : (
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 pl-10 rounded-lg border ${
                          errors.role
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:ring-teal-500"
                        } focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                      >
                        <option value="">Select role</option>
                        <option value="EMPLOYEE">Employee</option>
                      </select>
                    )}
                    {errors.role && (
                      <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                    )}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label
                    htmlFor="image"
                    className=" text-sm font-medium text-gray-700 mb-1 flex items-center"
                  >
                    <FiUpload className="mr-2 text-teal-600" />
                    Profile Image
                  </label>
                  <div className="relative">
                    <input
                      name="image"
                      onChange={handleChange}
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                    {formData.image && (
                      <p className="mt-2 text-sm text-gray-600">
                        {formData.image.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form actions */}
              <div className="flex sm:justify-end pt-6 border-t border-gray-200 sm:flex-row flex-col gap-5">
                <button
                  type="button"
                  onClick={() => navigate("/admin/employee-dashboard")}
                  className="mr-4 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all flex items-center justify-center cursor-pointer"
                >
                  <FiPlus className="mr-2" />
                  {user.role === "ADMIN" ? "Add Employee" : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Employee Info Card */}
        <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FiUser className="mr-2 text-teal-600" />
              Employee Management Tips
            </h3>
            <div className="mt-4 text-sm text-gray-600 space-y-2">
              <p>
                • Use clear naming conventions for employee IDs (e.g., DEPT-001,
                DEPT-002)
              </p>
              <p>• Ensure email addresses follow company domain standards</p>
              <p>• Set strong passwords that meet security requirements</p>
              <p>• Assign appropriate roles based on job responsibilities</p>
              <p>• Regularly update employee records as information changes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
