import React, { useState, useEffect } from "react";
import {
  FaUserPlus,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelope,

  FaCalendarAlt,
  FaIdCard,
  FaBuilding,

  FaTable,
  FaTh,
  FaSearch,
  FaDownload,
  FaVenusMars,
  FaHeart,
  FaMoneyBillWave,
  FaMapPin
} from "react-icons/fa";
import axios from "axios";
import { AllApi } from "../../CommonApiContainer/AllApi";

const RequestedEmp = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };


  const genderIcons = {
    Male: <FaVenusMars className="text-blue-500" />,
    Female: <FaVenusMars className="text-pink-500" />,
    Other: <FaVenusMars className="text-purple-500" />
  };

  const maritalStatusIcons = {
    married: <FaHeart className="text-red-500" />,
    "non-married": <FaHeart className="text-gray-400" />
  };

  // Format employee data from backend
  const formatEmployeeData = (data) => {
    return data.map(emp => ({
      id: emp._id,
      employeeId: emp.employeeId,
      name: emp.requestedBy?.name || emp.userId?.name || "N/A",
      email: emp.requestedBy?.email || emp.userId?.email || "N/A",
      profilePic: emp.requestedBy?.profilePic || emp.userId?.profilePic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      department: emp.department?.dep_name || "N/A",
      position: emp.department?.dep_name ? `${emp.department.dep_name} Role` : "Not Specified",
      location: emp.address || "Address not provided",
      appliedDate: emp.requestDate,
      status: emp.status,
      gender: emp.gender,
      maritalStatus: emp.maritalStatus,
      dob: emp.dob,
      salary: emp.salary,
      departmentDetails: emp.department,
      userId: emp.userId,
      requestedBy: emp.requestedBy
    }));
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${AllApi.requestedEmployees.url}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });   
        if (response.data && response.data.data) {
          const formattedEmployees = formatEmployeeData(response.data.data);
          setEmployees(formattedEmployees);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleStatusUpdate = async (employeeId, newStatus) => {
    try {
      await axios.put(`${AllApi.updateStatus.url}/${employeeId}/status`, {
        status: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      // Update local state
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === employeeId ? { ...emp, status: newStatus } : emp
        )
      );
      
      // Close modal if open
      if (selectedEmployee && selectedEmployee.id === employeeId) {
        setSelectedEmployee(null);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      employee.employeeId?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      employee.department?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase()?.includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || employee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.appliedDate) - new Date(a.appliedDate);
      case "oldest":
        return new Date(a.appliedDate) - new Date(b.appliedDate);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(salary);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Employee Requests
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <FaUserPlus className="text-blue-500" />
              Manage and review incoming employee applications
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl shadow-sm border border-gray-200 transition-all duration-200 flex items-center gap-2">
              <FaDownload className="text-green-500" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 w-full lg:w-auto">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, employee ID, department, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filters and View Toggles */}
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Sort by Name</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "table"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FaTable size={16} />
                </button>
                <button
                  onClick={() => setViewMode("card")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "card"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FaTh size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Stats Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
              <span className="text-gray-600">
                Pending: {employees.filter((e) => e.status === "pending").length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-400 rounded-full"></span>
              <span className="text-gray-600">
                Approved: {employees.filter((e) => e.status === "approved").length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-400 rounded-full"></span>
              <span className="text-gray-600">
                Rejected: {employees.filter((e) => e.status === "rejected").length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
              <span className="text-gray-600">Total: {employees.length}</span>
            </div>
          </div>
        </div>

        {/* Table View */}
        {viewMode === "table" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department & Position
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact & Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedEmployees.map((employee) => (
                  <tr
                    key={employee.employeeId}
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                          src={employee.profilePic}
                          alt={employee.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <FaIdCard className="text-gray-400" />
                            ID: {employee.employeeId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {employee.department}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <FaBuilding className="text-gray-400" />
                        {employee.position}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors">
                        <FaEnvelope className="text-gray-400" />
                        {employee.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        {genderIcons[employee.gender]}
                        {employee.gender}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <FaCalendarAlt className="text-gray-400" />
                        {formatDate(employee.appliedDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                          statusColors[employee.status]
                        }`}
                      >
                        {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(employee.employeeId, "active");
                          }}
                          className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors duration-200"
                          title="Approve"
                        >
                          <FaCheckCircle size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(employee.employeeId, "rejected");
                          }}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                          title="Reject"
                        >
                          <FaTimesCircle size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEmployee(employee);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                          title="View Details"
                        >
                          <FaEye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Card View */}
        {viewMode === "card" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
            {sortedEmployees.map((employee) => (
              <div
                key={employee.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => setSelectedEmployee(employee)}
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md"
                        src={employee.profilePic}
                        alt={employee.name}
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {employee.name}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <FaIdCard className="text-gray-400" />
                          ID: {employee.employeeId}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        statusColors[employee.status]
                      }`}
                    >
                      {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {employee.department}
                    </h4>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <FaBuilding className="text-gray-400" />
                      {employee.position}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaMapPin className="text-gray-400" />
                    <span className="truncate">{employee.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCalendarAlt className="text-gray-400" />
                    Applied: {formatDate(employee.appliedDate)}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaEnvelope className="text-gray-400" />
                    <span className="cursor-pointer hover:text-blue-600 transition-colors truncate">
                      {employee.email}
                    </span>
                  </div>

                  {/* Additional Info */}
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      {genderIcons[employee.gender]}
                      <span>{employee.gender}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      {maritalStatusIcons[employee.maritalStatus]}
                      <span>{employee.maritalStatus}</span>
                    </div>
                  </div>

                  {/* Salary */}
                  {employee.salary > 0 && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <FaMoneyBillWave className="text-green-500" />
                      <span className="font-medium">{formatSalary(employee.salary)}</span>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {formatDate(employee.dob)}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(employee.employeeId, "active");
                        }}
                        className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-100 transition-colors duration-200"
                        title="Approve"
                      >
                        <FaCheckCircle size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(employee.employeeId, "rejected");
                        }}
                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-colors duration-200"
                        title="Reject"
                      >
                        <FaTimesCircle size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmployee(employee);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        title="View Details"
                      >
                        <FaEye size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {sortedEmployees.length === 0 && (
          <div className="text-center py-12">
            <FaUserPlus className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No employee requests found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No employee requests have been submitted yet."}
            </p>
          </div>
        )}
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Employee Details
                </h2>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimesCircle size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Employee Info */}
                <div className="flex items-center gap-4">
                  <img
                    className="h-20 w-20 rounded-full object-cover border-2 border-white shadow-md"
                    src={selectedEmployee.profilePic}
                    alt={selectedEmployee.name}
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedEmployee.name}
                    </h3>
                    <p className="text-gray-500">{selectedEmployee.position}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                          statusColors[selectedEmployee.status]
                        }`}
                      >
                        {selectedEmployee.status.charAt(0).toUpperCase() + selectedEmployee.status.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ID: {selectedEmployee.employeeId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <DetailItem
                      icon={FaEnvelope}
                      label="Email"
                      value={selectedEmployee.email}
                    />
                    <DetailItem
                      icon={FaBuilding}
                      label="Department"
                      value={selectedEmployee.department}
                    />
                    <DetailItem
                      icon={FaVenusMars}
                      label="Gender"
                      value={selectedEmployee.gender}
                    />
                    <DetailItem
                      icon={FaCalendarAlt}
                      label="Date of Birth"
                      value={formatDate(selectedEmployee.dob)}
                    />
                  </div>
                  <div className="space-y-4">
                    <DetailItem
                      icon={FaMapPin}
                      label="Address"
                      value={selectedEmployee.location}
                    />
                    <DetailItem
                      icon={FaCalendarAlt}
                      label="Applied Date"
                      value={formatDate(selectedEmployee.appliedDate)}
                    />
                    <DetailItem
                      icon={FaHeart}
                      label="Marital Status"
                      value={selectedEmployee.maritalStatus}
                    />
                    {selectedEmployee.salary > 0 && (
                      <DetailItem
                        icon={FaMoneyBillWave}
                        label="Salary"
                        value={formatSalary(selectedEmployee.salary)}
                      />
                    )}
                  </div>
                </div>

                {/* Department Description */}
                {selectedEmployee.departmentDetails?.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Department Description</h4>
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                      {selectedEmployee.departmentDetails.description}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedEmployee.employeeId, "active");
                    }}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <FaCheckCircle />
                    Approve Request
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedEmployee.employeeId, "rejected");
                    }}
                    className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <FaTimesCircle />
                    Reject Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for detail items
const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <Icon className="text-gray-400 flex-shrink-0 mt-1" />
    <div className="flex-1">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-gray-900 font-medium break-words">{value || "Not provided"}</p>
    </div>
  </div>
);

export default RequestedEmp;