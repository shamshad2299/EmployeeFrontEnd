import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { 
  FiPlusCircle, 
  FiBriefcase, 
  FiFileText, 
  FiArrowLeft, 
  FiUser,
  FiMail,
  FiMapPin,
  FiInfo
} from "react-icons/fi";
import Loader from "../Loader";
import { AllApi } from "../../CommonApiContainer/AllApi";
import LoadingSpinner from "../common/LoadingSpinner";

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <LoadingSpinner text="Adding Department Please wait..." size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button - Mobile Optimized */}
        <div className="mb-4 sm:mb-6 lg:mb-8 px-2">
          <button 
            onClick={() => navigate("/admin/departments")}
            className="flex items-center text-teal-600 hover:text-teal-800 transition-colors group"
          >
            <div className="bg-white rounded-lg shadow-sm p-2 group-hover:shadow-md transition-shadow">
              <FiArrowLeft className="text-lg sm:text-xl" />
            </div>
            <span className="ml-3 text-sm sm:text-base font-medium">Back to Departments</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Form Section */}
          <div className="flex-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-4 sm:p-6 text-white">
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
                    <FiBriefcase className="text-xl sm:text-2xl lg:text-3xl" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
                      Create New Department
                    </h2>
                    <p className="text-teal-100 text-sm sm:text-base opacity-90">
                      Add a new department to your organization
                    </p>
                  </div>
                </div>
              </div>

              {/* Form section */}
              <div className="p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    {/* Department Name */}
                    <div>
                      <label htmlFor="dep_name" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FiBriefcase className="mr-2 text-teal-600 text-base" />
                        Department Name*
                      </label>
                      <div className="relative">
                        <input
                          name="dep_name"
                          value={department.dep_name}
                          onChange={handleChange}
                          type="text"
                          placeholder="e.g., Human Resources, Engineering"
                          className={`block w-full px-4 py-3 text-sm sm:text-base rounded-lg border ${
                            errors.dep_name 
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                              : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                          } shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                        />
                        {errors.dep_name && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <FiInfo className="mr-1" />
                            {errors.dep_name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Two Column Layout for Medium+ Screens */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Department Head */}
                      <div>
                        <label htmlFor="department_head" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <FiUser className="mr-2 text-teal-600 text-base" />
                          Department Head
                        </label>
                        <input
                          name="department_head"
                          value={department.department_head}
                          onChange={handleChange}
                          type="text"
                          placeholder="Name of department head"
                          className="block w-full px-4 py-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-teal-500 focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all"
                        />
                      </div>

                      {/* Contact Email */}
                      <div>
                        <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <FiMail className="mr-2 text-teal-600 text-base" />
                          Contact Email
                        </label>
                        <div className="relative">
                          <input
                            name="contact_email"
                            value={department.contact_email}
                            onChange={handleChange}
                            type="email"
                            placeholder="department@company.com"
                            className={`block w-full px-4 py-3 text-sm sm:text-base rounded-lg border ${
                              errors.contact_email 
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                                : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                            } shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                          />
                          {errors.contact_email && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <FiInfo className="mr-1" />
                              {errors.contact_email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FiMapPin className="mr-2 text-teal-600 text-base" />
                        Location
                      </label>
                      <input
                        name="location"
                        value={department.location}
                        onChange={handleChange}
                        type="text"
                        placeholder="Building/Floor/Room"
                        className="block w-full px-4 py-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-teal-500 focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FiFileText className="mr-2 text-teal-600 text-base" />
                        Description*
                      </label>
                      <div className="relative">
                        <textarea
                          name="description"
                          value={department.description}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Describe the department's purpose, responsibilities, and any other relevant information..."
                          className={`block w-full px-4 py-3 text-sm sm:text-base rounded-lg border ${
                            errors.description 
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                              : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                          } shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all resize-vertical`}
                        />
                        {errors.description && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <FiInfo className="mr-1" />
                            {errors.description}
                          </p>
                        )}
                        <div className="flex justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            Minimum 20 characters
                          </p>
                          <p className={`text-xs ${
                            department.description.length < 20 ? 'text-red-500' : 'text-green-500'
                          }`}>
                            {department.description.length}/20
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form actions */}
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => navigate("/admin/departments")}
                      className="order-2 sm:order-1 px-4 sm:px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="order-1 sm:order-2 px-4 sm:px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all flex items-center justify-center text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiPlusCircle className="mr-2 text-base" />
                      {loading ? "Creating..." : "Create Department"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Tips Sidebar - Hidden on small screens, visible on large screens */}
          <div className="lg:w-80 xl:w-96">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden sticky top-6">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                  <div className="bg-teal-100 p-2 rounded-lg mr-3">
                    <FiInfo className="text-teal-600 text-lg" />
                  </div>
                  Creation Tips
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <div className="bg-blue-50 rounded-full p-1 mt-0.5 mr-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span>Use clear, descriptive names that reflect the department's function</span>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-50 rounded-full p-1 mt-0.5 mr-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span>Include detailed descriptions to help employees understand roles</span>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-50 rounded-full p-1 mt-0.5 mr-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                    <span>Specify department heads for better accountability</span>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-orange-50 rounded-full p-1 mt-0.5 mr-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <span>Add contact information for easier communication</span>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-red-50 rounded-full p-1 mt-0.5 mr-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <span>Consider physical location if relevant to your organization</span>
                  </div>
                </div>

                {/* Quick Stats - Only show on larger screens */}
                <div className="mt-6 pt-6 border-t border-gray-200 hidden lg:block">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Best Practices</h4>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Department Name Length</span>
                      <span className="font-medium">3-50 chars</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Description Length</span>
                      <span className="font-medium">20-500 chars</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email Format</span>
                      <span className="font-medium">Optional</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Tips Card - Only show on small screens */}
            <div className="lg:hidden mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4">
                <h3 className="text-base font-medium text-gray-900 flex items-center mb-3">
                  <FiInfo className="mr-2 text-teal-600" />
                  Quick Tips
                </h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• Use clear, descriptive department names</p>
                  <p>• Provide detailed descriptions (min. 20 chars)</p>
                  <p>• Add department head for accountability</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;