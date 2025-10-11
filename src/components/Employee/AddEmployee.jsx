
import React, { useEffect, useState, useCallback } from "react";
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
  FiCheck,
  FiX
} from "react-icons/fi";
import LoadingSpinner from "../common/LoadingSpinner";

const AddEmployee = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userId"));
  const isAdmin = user?.role === "ADMIN";
  
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
  

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { department } = useAuth();
  const [deps, setDep] = useState([]);

  // Initialize departments
  useEffect(() => {
    if (department) {
      setDep(department);
    }
  }, [department]);

  // Form validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Common validations for both admin and employee request
    if (!formData.name?.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    }

    if (!formData.gender || formData.gender === "select") {
      newErrors.gender = "Please select gender";
    }

    if (!formData.department || formData.department === "select") {
      newErrors.department = "Please select department";
    }

    if (!formData.role || formData.role === "") {
      newErrors.role = "Please select role";
    }

    // Admin-specific validations
    if (isAdmin) {
      if (!formData.email?.trim()) {
        newErrors.email = "Email is required";
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      if (!formData.employeeId?.trim()) {
        newErrors.employeeId = "Employee ID is required";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (!formData.salary || parseFloat(formData.salary) <= 0) {
        newErrors.salary = "Please enter a valid salary amount";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isAdmin]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "image") {
      setFormData((prev) => ({ ...prev, [name]: files[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare data based on user type
      const submitData = new FormData();
      
      // Common fields for both admin and employee request
      submitData.append("name", formData.name.trim());
      submitData.append("dob", formData.dob);
      submitData.append("gender", formData.gender);
      submitData.append("maritalStatus", formData.maritalStatus || "");
      submitData.append("address", formData.address || "");
      submitData.append("department", formData.department);
      submitData.append("role", formData.role);
      
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      // Admin-specific fields
      if (isAdmin) {
        submitData.append("email", formData.email.trim());
        submitData.append("employeeId", formData.employeeId.trim());
        submitData.append("password", formData.password);
        submitData.append("salary", formData.salary);
      }

      // Use the SAME endpoint - backend will handle based on user role
      const response = await axios.post(AllApi.addEmployee.url, submitData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const successMessage = isAdmin 
          ? "👨‍💼 Employee added successfully!" 
          : "📨 Employee request submitted for approval!";
        
        toast.success(successMessage);
        
        // Reset form
        setFormData({
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

        setTimeout(() => navigate(isAdmin ? "/admin/employee-dashboard" : "/employee-dashboard"), 2000);
      } else {
        toast.error(response.data.message || "Operation failed");
        setErrors(response.data.errors || {});
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error.response?.data?.message || 
        (isAdmin ? "Failed to add employee" : "Failed to submit employee request");
      toast.error(errorMessage);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (Object.values(formData).some(value => value !== "" && value !== null)) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate(isAdmin ? "/admin/employee-dashboard" : "/employee-dashboard");
      }
    } else {
      navigate(isAdmin ? "/admin/employee-dashboard" : "/employee-dashboard");
    }
  };


  // ... (JSX part remains the same as previous premium version)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center text-teal-600 hover:text-teal-800 transition-all duration-200 mb-4 group"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">
              {isAdmin ? "Back to Employee Dashboard" : "Back to Dashboard"}
            </span>
          </button>

          <div className="bg-gradient-to-r from-teal-500 to-teal-700 rounded-2xl shadow-2xl p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <FiUser className="text-2xl sm:text-3xl" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {isAdmin ? "Add New Employee" : "Request New Employee"}
                </h1>
                <p className="text-teal-100 mt-1 text-sm sm:text-base">
                  {isAdmin 
                    ? "Create a new employee account with full access" 
                    : "Submit a request for new employee hiring approval"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              <div className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                      <FiUser className="mr-2 text-teal-600" />
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <FiUser className="mr-2 text-teal-600" />
                          Full Name *
                        </label>
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          type="text"
                          placeholder="John Doe"
                          className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                            errors.name 
                              ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                              : "border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          } shadow-sm`}
                        />
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <FiCalendar className="mr-2 text-teal-600" />
                          Date of Birth *
                        </label>
                        <input
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          type="date"
                          max={new Date().toISOString().split("T")[0]}
                          className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                            errors.dob 
                              ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                              : "border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          } shadow-sm`}
                        />
                        {errors.dob && (
                          <p className="mt-2 text-sm text-red-600">{errors.dob}</p>
                        )}
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <FiUser className="mr-2 text-teal-600" />
                          Gender *
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                            errors.gender 
                              ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                              : "border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          } shadow-sm`}
                        >
                          <option value="select">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.gender && (
                          <p className="mt-2 text-sm text-red-600">{errors.gender}</p>
                        )}
                      </div>

                      {/* Marital Status */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <FiUsers className="mr-2 text-teal-600" />
                          Marital Status
                        </label>
                        <select
                          name="maritalStatus"
                          value={formData.maritalStatus}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all duration-200"
                        >
                          <option value="status">Select Status</option>
                          <option value="married">Married</option>
                          <option value="non-married">Not Married</option>
                        </select>
                      </div>

                      {/* Address */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <FiHome className="mr-2 text-teal-600" />
                          Address
                        </label>
                        <input
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          type="text"
                          placeholder="123 Main Street, City, State, ZIP Code"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Employment Information Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                      <FiBriefcase className="mr-2 text-teal-600" />
                      Employment Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Department */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <FiBriefcase className="mr-2 text-teal-600" />
                          Department *
                        </label>
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                            errors.department 
                              ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                              : "border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          } shadow-sm`}
                        >
                          <option value="select">Select Department</option>
                          {deps?.map((dep) => (
                            <option key={dep._id} value={dep._id}>
                              {dep.dep_name}
                            </option>
                          ))}
                        </select>
                        {errors.department && (
                          <p className="mt-2 text-sm text-red-600">{errors.department}</p>
                        )}
                      </div>

                      {/* Role */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <FiUser className="mr-2 text-teal-600" />
                          Role *
                        </label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                            errors.role 
                              ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                              : "border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          } shadow-sm`}
                        >
                          <option value="">Select Role</option>
                          {isAdmin ? (
                            <>
                              <option value="ADMIN">Admin</option>
                              <option value="EMPLOYEE">Employee</option>
                              <option value="GENERAL">General</option>
                            </>
                          ) : (
                            <option value="EMPLOYEE">Employee</option>
                          )}
                        </select>
                        {errors.role && (
                          <p className="mt-2 text-sm text-red-600">{errors.role}</p>
                        )}
                      </div>

                      {/* Admin-only fields */}
                      {isAdmin && (
                        <>
                          {/* Email */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <FiMail className="mr-2 text-teal-600" />
                              Email *
                            </label>
                            <input
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              type="email"
                              placeholder="john.doe@company.com"
                              className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                                errors.email 
                                  ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                                  : "border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                              } shadow-sm`}
                            />
                            {errors.email && (
                              <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                            )}
                          </div>

                          {/* Employee ID */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <FiCreditCard className="mr-2 text-teal-600" />
                              Employee ID *
                            </label>
                            <input
                              name="employeeId"
                              value={formData.employeeId}
                              onChange={handleChange}
                              type="text"
                              placeholder="EMP-001"
                              className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                                errors.employeeId 
                                  ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                                  : "border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                              } shadow-sm`}
                            />
                            {errors.employeeId && (
                              <p className="mt-2 text-sm text-red-600">{errors.employeeId}</p>
                            )}
                          </div>

                          {/* Salary */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <FiDollarSign className="mr-2 text-teal-600" />
                              Salary *
                            </label>
                            <div className="relative">
                              <input
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                type="number"
                                placeholder="50000"
                                min="0"
                                step="0.01"
                                className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                                  errors.salary 
                                    ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                                    : "border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                } shadow-sm`}
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <span className="text-gray-500">$</span>
                              </div>
                            </div>
                            {errors.salary && (
                              <p className="mt-2 text-sm text-red-600">{errors.salary}</p>
                            )}
                          </div>

                          {/* Password */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <FiLock className="mr-2 text-teal-600" />
                              Password *
                            </label>
                            <input
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              type="password"
                              placeholder="••••••••"
                              autoComplete="new-password"
                              className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                                errors.password 
                                  ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                                  : "border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                              } shadow-sm`}
                            />
                            {errors.password && (
                              <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                            )}
                            <p className="mt-2 text-xs text-gray-500">
                              Must be 8+ characters with uppercase, lowercase, and number
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Profile Image Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                      <FiUpload className="mr-2 text-teal-600" />
                      Profile Image
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <FiUpload className="mr-2 text-teal-600" />
                          Upload Profile Picture
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            name="image"
                            onChange={handleChange}
                            type="file"
                            accept="image/*"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-all duration-200"
                          />
                          {formData.image && (
                            <div className="flex items-center space-x-2 text-sm text-green-600">
                              <FiCheck className="text-green-500" />
                              <span>{formData.image.name}</span>
                            </div>
                          )}
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          Recommended: Square image, max 5MB, JPG/PNG format
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={submitting}
                      className="w-full sm:w-auto px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 font-semibold disabled:opacity-50 flex items-center justify-center"
                    >
                      <FiX className="mr-2" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-8 py-3 border-2 border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 font-semibold disabled:opacity-50 flex items-center justify-center"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          {isAdmin ? "Adding Employee..." : "Submitting Request..."}
                        </>
                      ) : (
                        <>
                          <FiPlus className="mr-2" />
                          {isAdmin ? "Add Employee" : "Submit Request"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Information Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FiUser className="mr-2 text-teal-600" />
                {isAdmin ? "Quick Add" : "Request Status"}
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    isAdmin ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <p>
                    {isAdmin 
                      ? "Employee will be added immediately" 
                      : "Request will be reviewed by admin"
                    }
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>
                    {isAdmin 
                      ? "All fields marked * are required" 
                      : "Personal information is required for review"
                    }
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>
                    {isAdmin 
                      ? "Login credentials will be generated" 
                      : "You'll be notified once approved"
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Guidelines Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FiCheck className="mr-2 text-amber-600" />
                Guidelines
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Ensure all required fields are completed</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Use official email formats when applicable</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Verify department and role assignments</p>
                </div>
                {isAdmin && (
                  <>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p>Set secure passwords for new accounts</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p>Assign appropriate salary based on role</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AddEmployee);