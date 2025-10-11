import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AllApi } from "../../CommonApiContainer/AllApi";
import Loader from "../Loader.jsx";
import { useAuth } from "../../Store/authContext.jsx";
import {
  FiDollarSign,
  FiUser,
  FiCalendar,
  FiPlus,
  FiMinus,
  FiBriefcase,
  FiArrowLeft,
  FiCreditCard,
  FiTrendingUp,
  FiAward,
  FiCheck,
} from "react-icons/fi";
import LoadingSpinner from "../common/LoadingSpinner.jsx";

const Add = () => {
  const navigate = useNavigate();
  const [getDepartment, setDepartment] = useState([]);
  const [getEmployees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { department } = useAuth();

  const [salary, setSalary] = useState({
    employeeId: "",
    salary: "",
    deduction: "",
    allowance: "",
    payDate: "",
    selectedDepartment: "",
  });

  const [errors, setErrors] = useState({});

  // Calculate net salary
  const netSalary = useCallback(() => {
    const basic = parseFloat(salary.salary) || 0;
    const allowance = parseFloat(salary.allowance) || 0;
    const deduction = parseFloat(salary.deduction) || 0;
    return (basic + allowance - deduction).toFixed(2);
  }, [salary.salary, salary.allowance, salary.deduction]);

  // Initialize departments
  useEffect(() => {
    if (department) {
      setDepartment(department);
    }
  }, [department]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!salary.selectedDepartment) {
      newErrors.selectedDepartment = "Please select a department";
    }

    if (!salary.employeeId) {
      newErrors.employeeId = "Please select an employee";
    }

    if (!salary.salary || parseFloat(salary.salary) <= 0) {
      newErrors.salary = "Please enter a valid salary amount";
    }

    if (!salary.payDate) {
      newErrors.payDate = "Please select pay date";
    }

    if (salary.deduction && parseFloat(salary.deduction) < 0) {
      newErrors.deduction = "Deduction cannot be negative";
    }

    if (salary.allowance && parseFloat(salary.allowance) < 0) {
      newErrors.allowance = "Allowance cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalary((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Get employees by department
  const handleEmployeeByDep = async (e) => {
    const departmentId = e.target.value;
    setSalary((prev) => ({
      ...prev,
      selectedDepartment: departmentId,
      employeeId: "", // Reset employee when department changes
    }));

    if (!departmentId) {
      setEmployees([]);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const emp = await axios.get(
        `${AllApi.getEmployeeByDepId.url}/${departmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmployees(emp?.data?.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to load employees");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      setSubmitting(true);
      const salaryData = await axios.post(
        `${AllApi.addSalary.url}`,
        {
          ...salary,
          salary: parseFloat(salary.salary),
          deduction: parseFloat(salary.deduction) || 0,
          allowance: parseFloat(salary.allowance) || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (salaryData.data.success) {
        toast.success("💰 Salary added successfully!");
        setSalary(salaryData.data.data);
        setTimeout(
          () => navigate(`/admin/salary/${salaryData.data.data.employeeId}`),
          1500
        );
      } else {
        toast.error(salaryData.data.message || "Failed to add salary");
      }
    } catch (error) {
      console.error("Salary submission error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to add salary. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin`);
  };

  if (loading && !submitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <LoadingSpinner
            text="Sallary adding Please wait..."
            size="lg"
          />
        </div>
      </div>
    );
  }

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
            <span className="font-semibold">Back to Salary Management</span>
          </button>

          <div className="bg-gradient-to-r from-teal-500 to-teal-700 rounded-2xl shadow-2xl p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <FiDollarSign className="text-2xl sm:text-3xl" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Add Employee Salary
                </h1>
                <p className="text-teal-100 mt-1 text-sm sm:text-base">
                  Process salary payments with deductions and allowances
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              <div className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Department & Employee Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Department Selection */}
                    <div>
                      <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <FiBriefcase className="mr-2 text-teal-600" />
                        Department *
                      </label>
                      <div className="relative">
                        <select
                          onChange={handleEmployeeByDep}
                          name="selectedDepartment"
                          value={salary.selectedDepartment}
                          className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                            errors.selectedDepartment
                              ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          } shadow-sm appearance-none`}
                        >
                          <option value="">Select Department</option>
                          {getDepartment?.map((dep) => (
                            <option key={dep?._id} value={dep?._id}>
                              {dep?.dep_name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <FiBriefcase className="text-gray-400" />
                        </div>
                      </div>
                      {errors.selectedDepartment && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.selectedDepartment}
                        </p>
                      )}
                    </div>

                    {/* Employee Selection */}
                    <div>
                      <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <FiUser className="mr-2 text-teal-600" />
                        Employee *
                      </label>
                      <div className="relative">
                        <select
                          onChange={handleChange}
                          name="employeeId"
                          value={salary.employeeId}
                          className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                            errors.employeeId
                              ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          } shadow-sm appearance-none`}
                          disabled={!salary.selectedDepartment}
                        >
                          <option value="">Select Employee</option>
                          {getEmployees?.map((emp) => (
                            <option key={emp?._id} value={emp?._id}>
                              {emp?.employeeId} - {emp?.firstName}{" "}
                              {emp?.lastName}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <FiUser className="text-gray-400" />
                        </div>
                      </div>
                      {errors.employeeId && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.employeeId}
                        </p>
                      )}
                      {salary.selectedDepartment &&
                        getEmployees.length === 0 &&
                        !loading && (
                          <p className="mt-2 text-sm text-amber-600">
                            No employees found in this department
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Salary Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Basic Salary */}
                    <div>
                      <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <FiDollarSign className="mr-2 text-teal-600" />
                        Basic Salary *
                      </label>
                      <div className="relative">
                        <input
                          onChange={handleChange}
                          name="salary"
                          value={salary.salary}
                          type="number"
                          placeholder="0.00"
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
                        <p className="mt-2 text-sm text-red-600">
                          {errors.salary}
                        </p>
                      )}
                    </div>

                    {/* Allowance */}
                    <div>
                      <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <FiPlus className="mr-2 text-green-500" />
                        Allowance
                      </label>
                      <div className="relative">
                        <input
                          onChange={handleChange}
                          name="allowance"
                          value={salary.allowance}
                          type="number"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                            errors.allowance
                              ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          } shadow-sm`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                      </div>
                      {errors.allowance && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.allowance}
                        </p>
                      )}
                    </div>

                    {/* Deduction */}
                    <div>
                      <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <FiMinus className="mr-2 text-red-500" />
                        Deduction
                      </label>
                      <div className="relative">
                        <input
                          onChange={handleChange}
                          name="deduction"
                          value={salary.deduction}
                          type="number"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                            errors.deduction
                              ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          } shadow-sm`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                      </div>
                      {errors.deduction && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.deduction}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pay Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <FiCalendar className="mr-2 text-teal-600" />
                        Pay Date *
                      </label>
                      <div className="relative">
                        <input
                          onChange={handleChange}
                          name="payDate"
                          value={salary.payDate}
                          type="date"
                          className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                            errors.payDate
                              ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          } shadow-sm`}
                        />
                      </div>
                      {errors.payDate && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.payDate}
                        </p>
                      )}
                    </div>

                    {/* Net Salary Display */}
                    <div>
                      <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <FiCreditCard className="mr-2 text-blue-600" />
                        Net Salary
                      </label>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                        <div className="text-2xl font-bold text-blue-700 text-center">
                          ${netSalary()}
                        </div>
                        <p className="text-xs text-blue-600 text-center mt-1">
                          Basic + Allowance - Deduction
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={submitting}
                      className="w-full sm:w-auto px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 font-semibold disabled:opacity-50"
                    >
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
                          Processing...
                        </>
                      ) : (
                        <>
                          <FiCheck className="mr-2" />
                          Add Salary Record
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
            {/* Salary Summary Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FiTrendingUp className="mr-2 text-teal-600" />
                Salary Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Basic Salary:</span>
                  <span className="font-semibold">
                    ${salary.salary || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Allowance:</span>
                  <span className="font-semibold text-green-600">
                    +${salary.allowance || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Deduction:</span>
                  <span className="font-semibold text-red-600">
                    -${salary.deduction || "0.00"}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">
                      Net Salary:
                    </span>
                    <span className="font-bold text-blue-700">
                      ${netSalary()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guidelines Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FiAward className="mr-2 text-amber-600" />
                Salary Guidelines
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Ensure all required fields are filled (*)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Select department first to load employees</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Allowances include bonuses, incentives</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Deductions include taxes, insurance</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Net salary is calculated automatically</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-700 rounded-2xl shadow-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-teal-100">Departments:</span>
                  <span className="font-bold">
                    {getDepartment?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-teal-100">Employees:</span>
                  <span className="font-bold">{getEmployees?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-teal-100">Net Amount:</span>
                  <span className="font-bold">${netSalary()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Add);
