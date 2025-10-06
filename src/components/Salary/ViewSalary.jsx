import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { salaryColumns } from "../../pages/utils/EmployeeHelper";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../Store/authContext";
import { AllApi } from "../../CommonApiContainer/AllApi";
import Loader from "../Loader";
import { 
  FaMoneyBillWave, 
  FaSearch, 
  FaPlus, 
  FaHistory, 
  FaDownload,
  FaFilter,
  FaChartLine,
  FaUserTie,
  FaIdCard,
  FaCalendarAlt,
  FaDollarSign,
  FaReceipt
} from "react-icons/fa";
import { MdAttachMoney, MdPayments, MdAccountBalance } from "react-icons/md";
import { AccessDenied } from "../Leave/RequestLeave";

const ViewSalary = () => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [salaries, setSalaries] = useState([]);
  const [stats, setStats] = useState({
    totalSalary: 0,
    averageSalary: 0,
    totalDeductions: 0,
    totalAllowances: 0
  });
  

  // Get appropriate ID based on user role
  const getEmployeeId = () => {
    if (user?.role === "ADMIN") {
      return paramId;
    } else {
      const userData = JSON.parse(localStorage.getItem("userId"));
      return userData?._id || userData?.id;
    }
  };

  const employeeId = getEmployeeId();

  const fetchSalary = async () => {
    if (!employeeId) {
      console.error("No employee ID found");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${AllApi.viewSalary.url}/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        let sno = 1;
        const finalSalary = response.data.salary.map((sal) => ({
          id: sal?._id,
          sno: sno++,
          salary: sal?.salary,
          deduction: sal?.deduction,
          payable: sal?.netSalary,
          allowance: sal?.allowance,
          employeeId: sal?.employeeId?.employeeId,
          month: sal?.month || "N/A",
          year: sal?.year || new Date().getFullYear(),
          status: sal?.status || "Paid",
          paymentDate: sal?.paymentDate || new Date().toISOString().split('T')[0]
        }));
        
        setSalaries(finalSalary);
        calculateStats(finalSalary);
      }
    } catch (error) {
      console.error("Error fetching salary data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (salaryData) => {
    if (!salaryData.length) return;

    const totalSalary = salaryData.reduce((sum, item) => sum + (item.salary || 0), 0);
    const totalDeductions = salaryData.reduce((sum, item) => sum + (item.deduction || 0), 0);
    const totalAllowances = salaryData.reduce((sum, item) => sum + (item.allowance || 0), 0);
    
    setStats({
      totalSalary,
      averageSalary: totalSalary / salaryData.length,
      totalDeductions,
      totalAllowances
    });
  };

  useEffect(() => {
    if (employeeId) {
      fetchSalary();
    }
  }, [employeeId]);

  const handleAddSalary = () => {
    navigate("/admin/salary/add");
  };

  const handleExport = () => {
    // Export functionality would go here
    console.log("Exporting salary data...");
  };

  const filteredSalaries = salaries.filter(salary =>
    salary.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salary.month?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Enhanced columns with custom styling
  const enhancedColumns = [
    ...salaryColumns,
    {
      name: "Month",
      selector: row => row.month,
      sortable: true,
    },
    {
      name: "Year",
      selector: row => row.year,
      sortable: true,
    },
    {
      name: "Status",
      selector: row => row.status,
      sortable: true,
      cell: row => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          row.status === "Paid" 
            ? "bg-green-100 text-green-800" 
            : row.status === "Pending"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
        }`}>
          {row.status}
        </span>
      )
    }
  ];

  // Custom styles for DataTable
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#3B82F6',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold',
      },
    },
    rows: {
      style: {
        fontSize: '13px',
        '&:hover': {
          backgroundColor: '#F3F4F6',
          transition: 'background-color 0.2s ease',
        },
      },
    },
    cells: {
      style: {
        padding: '12px 8px',
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

    if(user.role !== "EMPLOYEE" && user.role !== "ADMIN"){
      return <AccessDenied />;
    }
    

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full shadow-lg">
              <FaMoneyBillWave className="text-white text-2xl" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Salary History
          </h1>
          <p className="text-gray-600 text-lg">
            Comprehensive overview of salary records and payments
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalSalary.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <MdAttachMoney className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Average Salary</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.averageSalary.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaChartLine className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Deductions</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalDeductions.toLocaleString()}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaReceipt className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">
                  {salaries.length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaHistory className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {user?.role === "ADMIN" && (
                <button
                  onClick={handleAddSalary}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaPlus className="text-sm" />
                  Add New Salary
                </button>
              )}
              
              <button
                onClick={handleExport}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaDownload className="text-sm" />
                Export Data
              </button>
            </div>

            <div className="relative w-full lg:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by ID or month..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MdPayments className="text-blue-600" />
              Salary Records
            </h3>
          </div>
          
          {filteredSalaries.length > 0 ? (
            <DataTable
              columns={enhancedColumns}
              data={filteredSalaries}
              customStyles={customStyles}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 15, 20]}
              highlightOnHover
              pointerOnHover
              responsive
              className="border-none"
            />
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMoneyBillWave className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No salary records found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Try adjusting your search terms" : "No salary records available for this employee"}
              </p>
              {user?.role === "ADMIN" && (
                <button
                  onClick={handleAddSalary}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-300"
                >
                  Add First Salary Record
                </button>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaUserTie className="text-blue-600" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group">
              <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                <FaIdCard className="text-blue-600" />
              </div>
              <span className="font-medium text-gray-700">Employee Profile</span>
            </button>
            
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-300 group">
              <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                <MdAccountBalance className="text-green-600" />
              </div>
              <span className="font-medium text-gray-700">Payroll Report</span>
            </button>
            
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 group">
              <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                <FaCalendarAlt className="text-purple-600" />
              </div>
              <span className="font-medium text-gray-700">Payment Schedule</span>
            </button>
            
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-300 group">
              <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                <FaDollarSign className="text-orange-600" />
              </div>
              <span className="font-medium text-gray-700">Tax Summary</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSalary;