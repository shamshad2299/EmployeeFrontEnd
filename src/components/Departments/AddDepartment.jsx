import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiPlusCircle, FiBriefcase, FiFileText, FiArrowLeft } from "react-icons/fi";
import Loader from "../Loader";
import { AllApi } from "../../CommonApiContainer/AllApi";

const AddDepartment = () => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState({
    dep_name: "",
    description: "",
    department_head: "",
    contact_email: "",
    location: ""
  });

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!department.dep_name.trim()) {
      newErrors.dep_name = "Department name is required";
    } else if (department.dep_name.trim().length < 3) {
      newErrors.dep_name = "Department name must be at least 3 characters";
    }

    if (!department.description.trim()) {
      newErrors.description = "Description is required";
    } else if (department.description.trim().length < 20) {
      newErrors.description = "Description should be at least 20 characters";
    }

    if (department.contact_email && !emailRegex.test(department.contact_email)) {
      newErrors.contact_email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await axios.post(
        AllApi.department.url,
        department,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => navigate("/admin/departments"), 1500);
      } else {
        toast.error(response.data.message || "Failed to add department");
        setErrors(response.data.error || {});
      }
    } catch (error) {
      console.error("Add department error:", error);
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred");
        setErrors(error.response.data.error || {});
      } else if (error.request) {
        toast.error("Network error - please check your connection");
      } else {
        toast.error("An unexpected error occurred");
      }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate("/admin/departments")}
            className="flex items-center text-teal-600 hover:text-teal-800 transition-colors mr-4"
          >
            <FiArrowLeft className="mr-2" />
            Back to Departments
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-6 text-white">
            <div className="flex items-center">
              <FiBriefcase className="text-3xl mr-4" />
              <div>
                <h2 className="text-2xl font-bold">Create New Department</h2>
                <p className="text-teal-100">Add a new department to your organization</p>
              </div>
            </div>
          </div>

          {/* Form section */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department Name */}
                <div className="col-span-2">
                  <label htmlFor="dep_name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiBriefcase className="mr-2 text-teal-600" />
                    Department Name*
                  </label>
                  <div className="relative">
                    <input
                      name="dep_name"
                      value={department.dep_name}
                      onChange={handleChange}
                      type="text"
                      placeholder="e.g., Human Resources, Engineering"
                      className={`block w-full px-4 py-3 rounded-lg border ${errors.dep_name ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"} shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                    />
                    {errors.dep_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.dep_name}</p>
                    )}
                  </div>
                </div>

                {/* Department Head */}
                <div>
                  <label htmlFor="department_head" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiBriefcase className="mr-2 text-teal-600" />
                    Department Head
                  </label>
                  <input
                    name="department_head"
                    value={department.department_head}
                    onChange={handleChange}
                    type="text"
                    placeholder="Name of department head"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-teal-500 focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiBriefcase className="mr-2 text-teal-600" />
                    Contact Email
                  </label>
                  <div className="relative">
                    <input
                      name="contact_email"
                      value={department.contact_email}
                      onChange={handleChange}
                      type="email"
                      placeholder="department@company.com"
                      className={`block w-full px-4 py-3 rounded-lg border ${errors.contact_email ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"} shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                    />
                    {errors.contact_email && (
                      <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiBriefcase className="mr-2 text-teal-600" />
                    Location
                  </label>
                  <input
                    name="location"
                    value={department.location}
                    onChange={handleChange}
                    type="text"
                    placeholder="Building/Floor/Room"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-teal-500 focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all"
                  />
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiFileText className="mr-2 text-teal-600" />
                    Description*
                  </label>
                  <div className="relative">
                    <textarea
                      name="description"
                      value={department.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Describe the department's purpose, responsibilities, and any other relevant information..."
                      className={`block w-full px-4 py-3 rounded-lg border ${errors.description ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"} shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">Minimum 20 characters</p>
                  </div>
                </div>
              </div>

              {/* Form actions */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/admin/departments")}
                  className="mr-4 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all flex items-center justify-center"
                >
                  <FiPlusCircle className="mr-2" />
                  {loading ? "Creating Department..." : "Create Department"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info card */}
        <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FiBriefcase className="mr-2 text-teal-600" />
              Department Creation Tips
            </h3>
            <div className="mt-4 text-sm text-gray-600 space-y-2">
              <p>• Use clear, descriptive names that reflect the department's function</p>
              <p>• Include a detailed description to help employees understand the department's role</p>
              <p>• Specify a department head for accountability</p>
              <p>• Add contact information for easier communication</p>
              <p>• Consider physical location if relevant to your organization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;