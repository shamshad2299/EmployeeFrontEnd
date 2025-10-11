import React, { useEffect, useState } from "react";
import { useAuth } from "../Store/authContext";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { employeeColumns } from "./utils/EmployeeHelper";
import { toast } from "react-toastify";
import axios from "axios";
import { AllApi } from "../CommonApiContainer/AllApi";
import Loader from "../components/Loader";
import { 
  FaUserPlus, 
  FaSearch, 
  FaFilter, 
  FaChartBar,
  FaUserTie,
  FaVenusMars,
  FaBirthdayCake,
  FaIdBadge,
  FaEdit,
  FaTrash,
  FaEye,
  FaUsers,
  FaCalendarAlt,
  FaPhone,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { MdEmail, MdWorkHistory, MdOutlineDashboard, MdLocalFireDepartment, MdMoney } from 'react-icons/md';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import LoadingSpinner from "../components/common/LoadingSpinner";

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [filterEmployees, setFilterEmployees] = useState([]);
  const [emLoading, setEmLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    male: 0,
    female: 0,
    active: 0,
    inactive: 0,
    departmentDistribution: [],
    experienceDistribution: []
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log(filterEmployees)

  // Check screen size for responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Gender distribution data for chart
  const genderData = [
    { name: 'Male', value: stats.male, color: '#3b82f6' },
    { name: 'Female', value: stats.female, color: '#ec4899' }
  ];

  // Status distribution data
  const statusData = [
    { name: 'Active', value: stats.active, color: '#10b981' },
    { name: 'Inactive', value: stats.inactive, color: '#ef4444' }
  ];

  // Department distribution data for chart
  const departmentData = stats.departmentDistribution.map(dept => ({
    name: dept.dep_name.length > 10 ? dept.dep_name.substring(0, 10) + '...' : dept.dep_name,
    fullName: dept.dep_name,
    employees: dept.count,
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`
  }));

  // Experience distribution data
  const experienceData = [
    { range: '0-2 yrs', employees: stats.experienceDistribution[0] || 0 },
    { range: '3-5 yrs', employees: stats.experienceDistribution[1] || 0 },
    { range: '6-8 yrs', employees: stats.experienceDistribution[2] || 0 },
    { range: '9+ yrs', employees: stats.experienceDistribution[3] || 0 }
  ];

  // Monthly hiring trend (mock data - you can replace with actual data)
  const hiringTrendData = [
    { month: 'Jan', hires: 5 },
    { month: 'Feb', hires: 8 },
    { month: 'Mar', hires: 12 },
    { month: 'Apr', hires: 7 },
    { month: 'May', hires: 15 },
    { month: 'Jun', hires: 10 }
  ];

  const fetchData = async () => {
    try {
      setEmLoading(true);
      const response = await axios.get(AllApi.getEmployee.url, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.data.success) {
        // Process employee data
        const employeesData = response.data.employees.map((emp, index) => ({
          id: emp._id,
          userId: emp.userId,
          image: (
            <img 
              width={40} 
              height={40} 
              className="rounded-full border-2 border-white shadow-sm cursor-pointer" 
              src={emp?.userId?.profilePic ? 
                `http://localhost:5000/uploads/${emp.userId.profilePic}` : 
                'https://randomuser.me/api/portraits/lego/5.jpg'
              }  
              onClick={() => navigate(`/admin/viewemployee/${emp._id}`)}
              alt={emp.userId.name}
            />
          ),
          sno: index + 1,
          name: emp.userId.name,
          email: emp.userId.email,
          phone: emp.phone || 'N/A',
          address: emp.address || 'N/A',
          gender: emp.gender || 'N/A',
          dob: emp.dob ? new Date(emp.dob).toLocaleDateString() : 'N/A',
          department: emp.department?.dep_name || 'N/A',
          position: emp.position || 'N/A',
          salary: emp.salary ? `$${emp.salary}` : 'N/A',
          joinDate: emp.joinDate ? new Date(emp.joinDate).toLocaleDateString() : 'N/A',
          status: emp.status || 'active',
          action: (
            <div className="flex space-x-2">
              <button 
                onClick={() => navigate(`/admin/viewemployee/${emp._id}`)}
                className="p-1 flex items-center justify-center gap-2 bg-blue-600 cursor-pointer text-white rounded hover:bg-blue-700 text-sm"
                title="View"
              >
                View
                <FaEye size={12} />
              </button>
              <button 
                onClick={() => handleEditEmployee(emp._id)}
                className="p-1 flex items-center justify-center gap-2 bg-green-600 cursor-pointer text-white rounded hover:bg-green-700 text-sm"
                title="Edit"
              >
                Edit
                <FaEdit size={12} />
              </button>
              <button 
                onClick={() => handleDeleteEmployee(emp._id, emp.userId.name)}
                className="p-1 flex items-center justify-center gap-2 cursor-pointer bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                title="Delete"
              >
                Delete
                <FaTrash size={12} />
              </button>

               <button 
                onClick={() => handleViewSalary(emp._id)}
                className="p-1 cursor-pointer flex items-center justify-center gap-2 bg-yellow-400 text-white rounded hover:bg-red-700 text-sm"
                title="Delete"
              >
                Sallary
                <MdMoney size={12} />
              </button>
            </div>
          )
        }));

        setEmployees(employeesData);
        setFilterEmployees(employeesData);

        // Calculate statistics
        const maleCount = response.data.employees.filter(e => e.gender === 'male').length;
        const femaleCount = response.data.employees.filter(e => e.gender === 'female').length;
        const activeCount = response.data.employees.filter(e => e.status === 'active').length;
        const inactiveCount = response.data.employees.filter(e => e.status === 'inactive').length;
        
        // Department distribution
        const departmentMap = {};
        response.data.employees.forEach(emp => {
          const depName = emp.department?.dep_name || 'Unassigned';
          departmentMap[depName] = (departmentMap[depName] || 0) + 1;
        });
        
        const departmentDistribution = Object.keys(departmentMap).map(dep_name => ({
          dep_name,
          count: departmentMap[dep_name]
        }));

        // Experience distribution (mock calculation - replace with actual data)
        const experienceDistribution = [8, 12, 5, 3]; // Example data

        setStats({
          total: response.data.employees.length,
          male: maleCount,
          female: femaleCount,
          active: activeCount,
          inactive: inactiveCount,
          departmentDistribution,
          experienceDistribution
        });
      }
    } catch(error) {
      console.error(error);
      toast.error("Failed to fetch employee data");
    } finally {
      setEmLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    let records = employees.filter(emp => 
      emp.name.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term) ||
      emp.department.toLowerCase().includes(term) ||
      emp.position.toLowerCase().includes(term)
    );

    // Apply department filter
    if (departmentFilter !== "all") {
      records = records.filter(emp => emp.department === departmentFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      records = records.filter(emp => emp.status === statusFilter);
    }

    setFilterEmployees(records);
  };

  const handleDepartmentFilter = (e) => {
    const dept = e.target.value;
    setDepartmentFilter(dept);
    
    let records = employees;
    
    if (dept !== "all") {
      records = records.filter(emp => emp.department === dept);
    }
    
    if (statusFilter !== "all") {
      records = records.filter(emp => emp.status === statusFilter);
    }
    
    if (searchTerm) {
      records = records.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm) ||
        emp.department.toLowerCase().includes(searchTerm) ||
        emp.position.toLowerCase().includes(term)
      );
    }
    
    setFilterEmployees(records);
  };

  const handleStatusFilter = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    
    let records = employees;
    
    if (status !== "all") {
      records = records.filter(emp => emp.status === status);
    }
    
    if (departmentFilter !== "all") {
      records = records.filter(emp => emp.department === departmentFilter);
    }
    
    if (searchTerm) {
      records = records.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm) ||
        emp.department.toLowerCase().includes(searchTerm) ||
        emp.position.toLowerCase().includes(term)
      );
    }
    
    setFilterEmployees(records);
  };

  const handleViewSalary =(id)=>{
    navigate(`/admin/salary/${id}`);
  }
  const handleEditEmployee = (id) => {
    navigate(`/admin/editemployee/${id}`);
  };

  const handleDeleteEmployee = async (id, name) => {

    alert("this functionality not yet added ! ");
    // if (window.confirm(`Are you sure you want to delete ${name}?`)) {
    //   try {
    //     const response = await axios.delete(`${AllApi.deleteEmployee.url}/${id}`, {
    //       headers: {
    //         "Authorization": `Bearer ${localStorage.getItem("token")}`
    //       }
    //     });
        
    //     if (response.data.success) {
    //       toast.success(`Employee ${name} deleted successfully`);
    //       fetchData(); // Refresh the data
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     toast.error("Failed to delete employee");
    //   }
    // }
  };

  // for mobile view card
  const EmployeeCard = ({ employee }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-center space-x-4 mb-3">
        <img 
          width={50} 
          height={50} 
          className="rounded-full border-2 border-white shadow-sm" 
          src={employee.userId?.profilePic ? 
            `http://localhost:5000/uploads/${employee.userId.profilePic}` : 
            'https://randomuser.me/api/portraits/lego/5.jpg'
          }  
          alt={employee.name}
        />
        <div>
          <h3 className="font-semibold text-gray-800">{employee.name}</h3>
          <p className="text-sm text-gray-600">{employee.position}</p>
        </div>
        <span className={`ml-auto px-2 py-1 rounded-full text-xs ${
          employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {employee.status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
        <div className="flex items-center">
          <MdEmail className="mr-1 text-blue-500" size={14} />
          <span className="truncate">{employee.email}</span>
        </div>
        <div className="flex items-center">
          <FaPhone className="mr-1 text-green-500" size={12} />
          <span>{employee.phone}</span>
        </div>
        <div className="flex items-center">
          <MdLocalFireDepartment className="mr-1 text-purple-500" size={14} />
          <span>{employee.department}</span>
        </div>
        <div className="flex items-center">
          <FaVenusMars className="mr-1 text-pink-500" size={12} />
          <span className="capitalize">{employee.gender}</span>
        </div>
      </div>
      
      <div className="flex justify-between pt-2 border-t border-gray-100">
        <button 
          onClick={() => navigate(`/admin/viewemployee/${employee.id}`)}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center"
        >
          <FaEye className="mr-1" size={12} />
          View
        </button>
        <div className="flex space-x-2">
          <button 
            onClick={() => handleEditEmployee(employee.id)}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center"
          >
            <FaEdit className="mr-1" size={12} />
            Edit
          </button>
          <button 
            onClick={() => handleDeleteEmployee(employee.id, employee.name)}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center"
          >
            <FaTrash className="mr-1" size={12} />
            Delete
          </button>
           <button 
                onClick={() => handleViewSalary(employee.id)}
                className="p-1 cursor-pointer flex items-center justify-center gap-2 bg-yellow-400 text-white rounded hover:bg-red-700 text-sm"
                title="Delete"
              >
                Sallary
                <MdMoney size={12} />
              </button>
        </div>
      </div>
    </div>
  );

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#f8fafc',
        borderBottomWidth: '1px',
        borderBottomColor: '#e2e8f0',
        fontWeight: '600',
      },
    },
    headCells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
    rows: {
      style: {
        minHeight: '72px',
        '&:not(:last-of-type)': {
          borderBottomWidth: '1px',
          borderBottomColor: '#e2e8f0',
        },
      },
    },
  };

   if (emLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <LoadingSpinner text="Loading allsalary Please wait..." size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <MdOutlineDashboard className="mr-2 text-blue-600" />
              Employee Dashboard
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Manage and analyze your organization's workforce
            </p>
          </div>
          <Link
            to="/admin/add-employees"
            className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 rounded-md text-white font-medium hover:bg-blue-700 flex items-center text-sm"
          >
            <FaUserPlus className="mr-2" />
            Add New Employee
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Total Employees</p>
                <h3 className="text-xl font-bold mt-1">{stats.total}</h3>
              </div>
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <FaUsers className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Active Employees</p>
                <h3 className="text-xl font-bold mt-1">{stats.active}</h3>
              </div>
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <FaUserTie className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-pink-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Male Employees</p>
                <h3 className="text-xl font-bold mt-1">{stats.male}</h3>
              </div>
              <div className="p-2 rounded-full bg-pink-100 text-pink-600">
                <FaVenusMars className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Departments</p>
                <h3 className="text-xl font-bold mt-1">{stats.departmentDistribution.length}</h3>
              </div>
              <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                <MdLocalFireDepartment className="text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
              <FaChartBar className="mr-2 text-blue-600" />
              Gender Distribution
            </h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
              <FaChartBar className="mr-2 text-blue-600" />
              Department Distribution
            </h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentData}
                  margin={{
                    top: 5,
                    right: 20,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Employees']} />
                  <Bar dataKey="employees" name="Employees" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
              <FaChartBar className="mr-2 text-blue-600" />
              Experience Distribution
            </h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={experienceData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="employees" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
              <FaChartBar className="mr-2 text-blue-600" />
              Hiring Trend
            </h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={hiringTrendData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="hires" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Employee Table/Card Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2 md:mb-0">
                Employee Directory
              </h2>
              <div className="flex items-center text-sm text-gray-600">
                <FaFilter className="mr-1" />
                <span>{filterEmployees.length} of {employees.length} employees</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, department or position..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  onChange={handleSearch}
                  value={searchTerm}
                />
              </div>
              
              <div className="flex gap-3">
                <div className="flex items-center bg-gray-50 rounded-md px-3 py-2 border border-gray-300">
                  <FaFilter className="text-gray-500 mr-2" />
                  <select 
                    className="bg-transparent border-none focus:ring-0 text-sm w-32"
                    onChange={handleDepartmentFilter}
                    value={departmentFilter}
                  >
                    <option value="all">All Departments</option>
                    {stats.departmentDistribution.map(dept => (
                      <option key={dept.dep_name} value={dept.dep_name}>
                        {dept.dep_name}
                      </option>
                    ))}
                  </select>
                </div>
                {console.log(filterEmployees)}
                
                <div className="flex items-center bg-gray-50 rounded-md px-3 py-2 border border-gray-300">
                  <FaFilter className="text-gray-500 mr-2" />
                  <select 
                    className="bg-transparent border-none focus:ring-0 text-sm"
                    onChange={handleStatusFilter}
                    value={statusFilter}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile View - Cards */}
          {isMobile ? (
            <div className="p-4">
              {filterEmployees.length > 0 ? (
                filterEmployees.map(employee => (
                  <EmployeeCard key={employee.id} employee={employee} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No employees found matching your criteria
                </div>
              )}
            </div>
          ) : (
            /* Desktop View - Table */
            <DataTable
              columns={employeeColumns}
              data={filterEmployees}
              pagination
              customStyles={customStyles}
              highlightOnHover
              pointerOnHover
              responsive
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;