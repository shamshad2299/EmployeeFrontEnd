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
  FaIdBadge
} from 'react-icons/fa';
import { MdEmail, MdWorkHistory, MdOutlineDashboard } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [filterEmployees, setFilterEmployees] = useState([]);
  const [emLoading, setEmLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    male: 0,
    female: 0,
    departmentDistribution: []
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  // Gender distribution data for chart
  const genderData = [
    { name: 'Male', value: stats.male, color: '#3b82f6' },
    { name: 'Female', value: stats.female, color: '#ec4899' }
  ];

  // Department distribution data for chart
  const departmentData = stats.departmentDistribution.map(dept => ({
    name: dept.dep_name,
    employees: dept.count,
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`
  }));

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
          gender: emp.gender || 'N/A',
          dob: emp.dob ? new Date(emp.dob).toLocaleDateString() : 'N/A',
          department: emp.department?.dep_name || 'N/A',
          status: (
            <span className={`px-2 py-1 rounded-full text-xs ${
              emp.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {emp.status || 'active'}
            </span>
          ),
          action: <button 
            onClick={() => navigate(`/admin/viewemployee/${emp._id}`)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            View
          </button>
        }));

        setEmployees(employeesData);
        setFilterEmployees(employeesData);

        // Calculate statistics
        const maleCount = response.data.employees.filter(e => e.gender === 'male').length;
        const femaleCount = response.data.employees.filter(e => e.gender === 'female').length;
        
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

        setStats({
          total: response.data.employees.length,
          male: maleCount,
          female: femaleCount,
          departmentDistribution
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
    const searchTerm = e.target.value.toLowerCase();
    const records = employees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm) ||
      emp.department.toLowerCase().includes(searchTerm)
    );
    setFilterEmployees(records);
  };

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
      <div className="flex w-full h-screen items-center justify-center">
        <Loader/>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <MdOutlineDashboard className="mr-2 text-blue-600" />
              Employee Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and analyze your organization's workforce
            </p>
          </div>
          <Link
            to="/admin/add-employees"
            className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 rounded-md text-white font-medium hover:bg-blue-700 flex items-center"
          >
            <FaUserPlus className="mr-2" />
            Add New Employee
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Employees</p>
                <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
              </div>
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <FaUserTie className="text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Male Employees</p>
                <h3 className="text-2xl font-bold mt-1">{stats.male}</h3>
              </div>
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <FaVenusMars className="text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-pink-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Female Employees</p>
                <h3 className="text-2xl font-bold mt-1">{stats.female}</h3>
              </div>
              <div className="p-2 rounded-full bg-pink-100 text-pink-600">
                <FaVenusMars className="text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Avg. Experience</p>
                <h3 className="text-2xl font-bold mt-1">3.2 yrs</h3>
              </div>
              <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                <MdWorkHistory className="text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaChartBar className="mr-2 text-blue-600" />
              Gender Distribution
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
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

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaChartBar className="mr-2 text-blue-600" />
              Department Distribution
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="employees" name="Employees" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Employee Table Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 md:mb-0">
              Employee Directory
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleSearch}
                />
              </div>
              <div className="flex items-center bg-gray-50 rounded-md px-3 py-2 border border-gray-300">
                <FaFilter className="text-gray-500 mr-2" />
                <select className="bg-transparent border-none focus:ring-0 text-sm">
                  <option>All Departments</option>
                  {stats.departmentDistribution.map(dept => (
                    <option key={dept.dep_name}>{dept.dep_name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <DataTable
            columns={employeeColumns}
            data={filterEmployees}
            pagination
            customStyles={customStyles}
            highlightOnHover
            pointerOnHover
            responsive
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;