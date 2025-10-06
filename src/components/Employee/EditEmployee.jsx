import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AllApi } from '../../CommonApiContainer/AllApi';
import Loader from '../Loader';
import { useAuth } from '../../Store/authContext';
import { 
  FiUser, FiCreditCard, FiCalendar, FiUsers, FiHome, 
  FiDollarSign, FiBriefcase, FiSave, FiArrowLeft 
} from 'react-icons/fi';

const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { department } = useAuth();
  const [deps, setDep] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    dob: "",
    role: "",
    gender: "",
    maritalStatus: "",
    address: "",
    department: "",
    salary: ""
  });

  useEffect(() => {
    if (department) {
      setDep(department);
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.employeeId) newErrors.employeeId = "Employee ID is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.gender || formData.gender === "select") newErrors.gender = "Gender is required";
    if (!formData.department || formData.department === "select") newErrors.department = "Department is required";
    if (!formData.salary) newErrors.salary = "Salary is required";
    if (!formData.role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${AllApi.editEmployee.url}/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (response.data.success) {
          const employeeData = response.data.employee;
          // Format the date for the input field
          const dobDate = employeeData.dob ? new Date(employeeData.dob) : null;
          const formattedDob = dobDate ? dobDate.toISOString().split('T')[0] : '';
          
          setFormData({
            name: employeeData.userId?.name || "",
            employeeId: employeeData.employeeId || "",
            dob: formattedDob,
            role: employeeData.userId?.role || "",
            gender: employeeData.gender || "",
            maritalStatus: employeeData.maritalStatus || "",
            address: employeeData.address || "",
            department: employeeData.department?.dep_name || "",
            salary: employeeData.salary || ""
          });
        } else {
          toast.error(response.data.message || "Failed to fetch employee data");
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
        toast.error("Error loading employee data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${AllApi.finalEditEmployee.url}/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          timeout: 5000
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => navigate("/admin/employee-dashboard"), 1000);
      } else {
        toast.error(response.data.message);
        setErrors(response.data.error || {});
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error(error.response?.data?.message || "Failed to update employee");
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/admin/employee-dashboard")}
            className="flex items-center text-teal-600 hover:text-teal-800 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Employees
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-6 text-white">
            <div className="flex items-center">
              <FiUser className="text-3xl mr-4" />
              <div>
                <h2 className="text-2xl font-bold">Edit Employee</h2>
                <p className="text-teal-100">Update employee information</p>
              </div>
            </div>
          </div>

          {/* Form section */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employee Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
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
                        errors.name ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
                      } focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>
                </div>

                {/* Employee ID */}
                <div>
                  <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
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
                        errors.employeeId ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
                      } focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                    />
                    {errors.employeeId && <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>}
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
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
                      className={`block w-full px-4 py-3 pl-10 rounded-lg border ${
                        errors.dob ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
                      } focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                    />
                    {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob}</p>}
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiUser className="mr-2 text-teal-600" />
                    Role*
                  </label>
                  <div className="relative">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 pl-10 rounded-lg border ${
                        errors.role ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
                      } focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                    >
                      <option value="">Select role</option>
                      <option value="ADMIN">Admin</option>
                      <option value="GENERAL">General</option>
                    </select>
                    {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiUser className="mr-2 text-teal-600" />
                    Gender*
                  </label>
                  <div className="relative">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 pl-10 rounded-lg border ${
                        errors.gender ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
                      } focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                    >
                      <option value="select">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                  </div>
                </div>

                {/* Marital Status */}
                <div>
                  <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiUsers className="mr-2 text-teal-600" />
                    Marital Status
                  </label>
                  <div className="relative">
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-teal-500 focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all"
                    >
                      <option value="status">Select Status</option>
                      <option value="married">Married</option>
                      <option value="non-married">Not Married</option>
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
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
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiBriefcase className="mr-2 text-teal-600" />
                    Department*
                  </label>
                  <div className="relative">
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 pl-10 rounded-lg border ${
                        errors.department ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
                      } focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                    >
                      <option value="select">Select Department</option>
                      {deps?.map((dep) => (
                        <option key={dep._id} value={dep.dep_name}>
                          {dep.dep_name}
                        </option>
                      ))}
                    </select>
                    {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
                  </div>
                </div>

                {/* Salary */}
                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
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
                        errors.salary ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
                      } focus:border-teal-500 shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all`}
                    />
                    {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary}</p>}
                  </div>
                </div>
              </div>

              {/* Form actions */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/admin/employee-dashboard")}
                  className="mr-4 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all flex items-center justify-center"
                >
                  <FiSave className="mr-2" />
                  Save Changes
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
              <p>• Keep employee records up-to-date with current information</p>
              <p>• Ensure department assignments reflect current organizational structure</p>
              <p>• Verify salary information matches employment contracts</p>
              <p>• Use standardized formats for employee IDs and other identifiers</p>
              <p>• Regularly review and update employee roles and permissions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;