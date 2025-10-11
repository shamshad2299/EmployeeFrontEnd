import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import { FiSave, FiArrowLeft, FiBriefcase, FiFileText, FiUser, FiMail, FiMapPin, FiCalendar } from 'react-icons/fi';
import { AllApi } from '../../CommonApiContainer/AllApi';
import Loader from '../Loader';
import LoadingSpinner from '../common/LoadingSpinner';

const EditDepartment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [department, setDepartment] = useState({
    dep_name: "",
    description: "",
    department_head: "",
    contact_email: "",
    location: "",
    established_date: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Memoized validation function
  const validateForm = useCallback(() => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!department.dep_name.trim()) {
      newErrors.dep_name = "Department name is required";
    } else if (department.dep_name.trim().length < 2) {
      newErrors.dep_name = "Department name must be at least 2 characters";
    }

    if (!department.description.trim()) {
      newErrors.description = "Description is required";
    } else if (department.description.trim().length < 10) {
      newErrors.description = "Description should be at least 10 characters";
    }

    if (department.contact_email && !emailRegex.test(department.contact_email)) {
      newErrors.contact_email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ 
        ...prev, 
        [name]: '' 
      }));
    }
  };

  const fetchDepartmentData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${AllApi.getDepartmentById.url}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.data.success) {
        const departmentData = response.data.department || response.data.data;
        
        if (departmentData) {
          setDepartment({
            dep_name: departmentData.dep_name || "",
            description: departmentData.description || "",
            department_head: departmentData.department_head || "",
            contact_email: departmentData.contact_email || "",
            location: departmentData.location || "",
            established_date: departmentData.established_date || departmentData.createdAt?.split('T')[0] || ""
          });
        }
      } else {
        toast.error(response.data.message || "Failed to fetch department data");
        navigate("/admin/departments");
      }
    } catch (error) {
      console.error("Error fetching department:", error);
      toast.error("Error loading department data");
      navigate("/admin/departments");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) {
      fetchDepartmentData();
    }
  }, [id, fetchDepartmentData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.put(
        `${AllApi.editDepartment.url}/${id}`,
        {
          ...department,
          dep_name: department.dep_name.trim(),
          description: department.description.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (response.data.success) {
        toast.success("Department updated successfully! 🎉");
        setTimeout(() => navigate("/admin/departments"), 1500);
      } else {
        toast.error(response.data.message || "Failed to update department");
      }
    } catch (error) {
      console.error("Update error:", error);
      if (error.response?.data) {
        const serverError = error.response.data;
        toast.error(serverError.message || "An error occurred while updating");
        if (serverError.errors) {
          setErrors(serverError.errors);
        }
      } else if (error.request) {
        toast.error("Network error - please check your connection");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (Object.values(department).some(value => value !== "")) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate("/admin/departments");
      }
    } else {
      navigate("/admin/departments");
    }
  };

  if (loading) {
     return (
       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
         <div className="bg-white rounded-2xl shadow-xl p-8">
           <LoadingSpinner text="Fetch Edited Department Please wait..." size="lg" />
         </div>
       </div>
     );
   }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={handleCancel}
          className="flex items-center text-teal-600 hover:text-teal-800 transition-all duration-200 mb-8 group cursor-pointer"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Departments</span>
        </button>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-6 sm:p-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <FiBriefcase className="text-2xl sm:text-3xl" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Edit Department</h1>
                <p className="text-teal-100 mt-1 text-sm sm:text-base">
                  Update department information and details
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department Name - Full Width */}
                <div className="lg:col-span-2">
                  <label htmlFor="dep_name" className=" text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FiBriefcase className="mr-2 text-teal-600" />
                    Department Name *
                  </label>
                  <div className="relative">
                    <input
                      id="dep_name"
                      name="dep_name"
                      value={department.dep_name}
                      onChange={handleChange}
                      type="text"
                      placeholder="e.g., Human Resources, Engineering"
                      className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                        errors.dep_name 
                          ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                          : "border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      } shadow-sm`}
                    />
                    {errors.dep_name && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  {errors.dep_name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      {errors.dep_name}
                    </p>
                  )}
                </div>

                {/* Department Head */}
                <div>
                  <label htmlFor="department_head" className=" text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FiUser className="mr-2 text-teal-600" />
                    Department Head
                  </label>
                  <input
                    id="department_head"
                    name="department_head"
                    value={department.department_head}
                    onChange={handleChange}
                    type="text"
                    placeholder="Name of department head"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all duration-200"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label htmlFor="contact_email" className=" text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FiMail className="mr-2 text-teal-600" />
                    Contact Email
                  </label>
                  <div className="relative">
                    <input
                      id="contact_email"
                      name="contact_email"
                      value={department.contact_email}
                      onChange={handleChange}
                      type="email"
                      placeholder="department@company.com"
                      className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                        errors.contact_email 
                          ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                          : "border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      } shadow-sm`}
                    />
                    {errors.contact_email && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  {errors.contact_email && (
                    <p className="mt-2 text-sm text-red-600">{errors.contact_email}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className=" text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FiMapPin className="mr-2 text-teal-600" />
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    value={department.location}
                    onChange={handleChange}
                    type="text"
                    placeholder="Building/Floor/Room"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all duration-200"
                  />
                </div>

                {/* Established Date */}
                <div>
                  <label htmlFor="established_date" className=" text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FiCalendar className="mr-2 text-teal-600" />
                    Established Date
                  </label>
                  <input
                    id="established_date"
                    name="established_date"
                    value={department.established_date}
                    onChange={handleChange}
                    type="date"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all duration-200"
                  />
                </div>

                {/* Description - Full Width */}
                <div className="lg:col-span-2">
                  <label htmlFor="description" className=" text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FiFileText className="mr-2 text-teal-600" />
                    Description *
                  </label>
                  <div className="relative">
                    <textarea
                      id="description"
                      name="description"
                      value={department.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Describe the department's purpose, responsibilities, and any other relevant information..."
                      className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 resize-none ${
                        errors.description 
                          ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                          : "border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      } shadow-sm`}
                    />
                    {errors.description && (
                      <div className="absolute top-3 right-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    {department.description.length}/10+ characters required
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 font-medium disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3 border-2 border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 font-medium disabled:opacity-50 flex items-center justify-center cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tips Card */}
        <div className="mt-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <div className="p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center mb-4">
              <FiBriefcase className="mr-3 text-teal-600" />
              Department Management Tips
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Keep department names clear and consistent</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Assign department heads for accountability</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Provide detailed descriptions of roles</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Include contact information for communication</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Update information regularly as needed</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Ensure email formats are correct</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(EditDepartment);