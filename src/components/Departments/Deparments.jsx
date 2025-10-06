import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FiSearch, FiPlus, FiTrash2, FiEdit2, FiInfo, FiBriefcase } from "react-icons/fi";
import axios from "axios";
import { AllApi } from "../../CommonApiContainer/AllApi";
import Loader from "../Loader";
import DepartmentCard from "./DepartmentCard"; // New component for card view
import EmptyState from "./EmptyState"; // For empty data handling

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'
  const [selectedDepartment, setSelectedDepartment] = useState(null);


  // Enhanced columns configuration
  const columns = [
    {
      name: "#",
      selector: row => row.sno,
      sortable: true,
      width: "70px"
    },
    {
      name: "Department Name",
      selector: row => row.dep_name,
      sortable: true,
      cell: row => (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
            <FiBriefcase className="text-teal-600" />
          </div>
          <span className="font-medium">{row.dep_name}</span>
        </div>
      )
    },
    {
      name: "Employees",
      selector: row => row.employeeCount || "N/A",
      sortable: true,
      width: "120px"
    },
    {
      name: "Actions",
      cell: row => (
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedDepartment(row)}
            className="p-2 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-full transition-colors"
            title="View Details"
          >
            <FiInfo size={18} />
          </button>
          <Link
            to={`/admin/edit-department/${row.id}`}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit"
          >
            <FiEdit2 size={18} />
          </Link>
          <button
            onClick={() => handleDeleteDepartment(row.id)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
            title="Delete"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
      width: "150px"
    }
  ];

  // Fetch department data
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(AllApi.getDepartment.url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
    

      if (response.data.sucess) {
        const enrichedData = response.data.data.map((dep, index) => ({
          id: dep._id,
          sno: index + 1,
          dep_name: dep.dep_name,
          description: dep.description,
          department_head: dep.department_head,
          location : dep.location,
          created_at: new Date(dep.createdAt).toLocaleDateString()
        }));
     
        setDepartments(enrichedData);
        setFilteredData(enrichedData);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDeleteDepartment = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axios.delete(`${AllApi.deleteDepartment.url}/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        toast.success("Department deleted successfully");
        await fetchDepartments();
      } catch (error) {
        toast.error("Failed to delete department");
        console.error("Delete error:", error);
      }
    }
  };

  const filterDepartments = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = departments.filter(dep =>
      dep.dep_name.toLowerCase().includes(searchTerm) ||
      (dep.description && dep.description.toLowerCase().includes(searchTerm)) ||
      (dep.department_head && dep.department_head.toLowerCase().includes(searchTerm))
    );
    setFilteredData(filtered);
  };

  // Custom styles for DataTable
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f7fafc",
        borderBottomWidth: "1px",
        borderColor: "#e2e8f0",
        fontWeight: "600",
        fontSize: "0.875rem",
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }
    },
    rows: {
      style: {
        minHeight: "72px",
        "&:not(:last-of-type)": {
          borderBottomWidth: "1px",
          borderColor: "#edf2f7"
        }
      }
    },
    pagination: {
      style: {
        backgroundColor: "#f7fafc",
        borderTopWidth: "1px",
        borderColor: "#e2e8f0"
      }
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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
            <p className="mt-2 text-gray-600">
              Manage and organize your company departments
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              to="/admin/add-departments"
              className="flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm transition-colors"
            >
              <FiPlus className="mr-2" />
              Add Department
            </Link>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search departments..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full md:w-64 transition-all"
                onChange={filterDepartments}
              />
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-end mb-6">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                viewMode === "table"
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                viewMode === "card"
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Card View
            </button>
          </div>
        </div>

        {/* Content */}
        {filteredData.length === 0 ? (
          <EmptyState
            title="No Departments Found"
            description="Create your first department to get started"
            actionText="Add Department"
            actionLink="/admin/add-departments"
          />
        ) : viewMode === "table" ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 20, 50]}
              customStyles={customStyles}
              highlightOnHover
              pointerOnHover
              responsive
              striped
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map(department => (
              <DepartmentCard
                key={department.id}
                department={department}
                onDelete={handleDeleteDepartment}
              />
            ))}
          </div>
        )}
      </div>

      {/* Department Details Modal */}
      {selectedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{selectedDepartment.dep_name}</h2>
                  <p className="text-teal-100">Department Details</p>
                </div>
                <button
                  onClick={() => setSelectedDepartment(null)}
                  className="text-teal-100 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Department Head</h3>
                  <p className="mt-1 text-gray-900">
                    {selectedDepartment.department_head || "Not specified"}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Employee Count</h3>
                  <p className="mt-1 text-gray-900">
                    {selectedDepartment.employeeCount}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created On</h3>
                  <p className="mt-1 text-gray-900">
                    {selectedDepartment.created_at}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-gray-900">
                  {selectedDepartment.description || "No description provided"}
                </p>
              </div>
              
              <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200">
                <button
                  onClick={() => setSelectedDepartment(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                >
                  Close
                </button>
                <Link
                  to={`/admin/edit-department/${selectedDepartment.id}`}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
                >
                  Edit Department
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;