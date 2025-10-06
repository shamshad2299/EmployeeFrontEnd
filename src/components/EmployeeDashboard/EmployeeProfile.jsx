import axios from 'axios';
import  { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AllApi } from '../../CommonApiContainer/AllApi';
import Loader from '../Loader';
import { FaUserTie, FaIdBadge, FaVenusMars, FaBirthdayCake, FaBuilding, FaHeart, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaBriefcase, FaGraduationCap, FaUserShield } from 'react-icons/fa';
import { MdEmail, MdWorkHistory, MdFamilyRestroom } from 'react-icons/md';
import { useNotice  } from '../../helper/Notice';

const EmployeeProfile = () => {
const user = JSON.parse(localStorage.getItem("userId"));
  const { NoticeComponent, showNotice } = useNotice();
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(false);


  const ViewEmployees = async () => {
    try {
      setLoading(true);
      const getData = await axios.get(`${AllApi.viewEmployee.url}/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (getData?.data?.success) {
        setEmployee(getData?.data?.employee);
      } else if (getData.data.error) {
        toast.error(getData.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch employee details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    ViewEmployees();
  }, []);
  console.log(employee)

   useEffect(() => {
    // Show different notices based on conditions
    if(employee?.status === "pending"){
        showNotice('employeeRequest', 1000);
    }
    else {
      showNotice('websiteUpdate' , 1000);
    }
      
   
  }, [employee?.status]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  // Department icons mapping
  const departmentIcons = {
    'HR': '👥',
    'IT': '💻',
    'Finance': '💰',
    'Marketing': '📢',
    'Sales': '📊',
    'Operations': '⚙️',
    'default': '🏢'
  };
    if (!employee) {
      return (
        <div className="min-h-screen  flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <FaUserShield className="text-yellow-500 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Employee Profile Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              You are not registered as an employee in our system.
            </p>
         <div className="flex gap-3">
             <button
              className=" cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => (window.location.href = "/employee-dashboard")}
            >
              Return to Dashboard
            </button>
            <button
              className=" cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => (window.location.href = "/employee-dashboard/request")}
            >
             Request for Employee
            </button>
         </div>
          </div>
        </div>
      );
    }

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4">
          {/* <AutoNotice type="welcomeBack" showDelay={100} /> */}
           {NoticeComponent}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-900 p-6 text-white">
            <h1 className="text-3xl font-bold">Employee Profile</h1>
            <p className="text-blue-100">Detailed information about the employee</p>
          </div>

          {/* Main Content */}
          <div className="md:flex">
            {/* Left Side - Profile Card */}
            <div className="md:w-1/3 p-6 border-r border-gray-200">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  {employee?.userId?.profilePic ? (
                    <img 
                      className="w-48 h-48 rounded-full border-4 border-white shadow-lg object-cover"
                      src={employee?.userId?.profilePic} 
                      alt="Profile" 
                    />
                  ) : (
                    <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center text-6xl">
                      👤
                    </div>
                  )}
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                    {employee?.department?.dep_name || 'Department'}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-4">{employee?.userId?.name}</h2>
                <p className="text-gray-600 mb-4">{employee?.designation || 'Employee'}</p>

                <div className="w-full bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <FaIdBadge className="text-blue-600 mr-2" />
                    <span className="font-semibold">Employee ID:</span>
                    <span className="ml-2 text-gray-700">{employee?.employeeId || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <FaUserTie className="text-blue-600 mr-2" />
                    <span className="font-semibold">Status:</span>
                    <span className="ml-2 font-bold px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full">
                      {employee?.status}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <FaBuilding className="mr-2" /> Department Info
                  </h3>
                  <div className="flex items-center mb-1">
                    <span className="text-2xl mr-2">
                      {departmentIcons[employee?.department?.dep_name] || departmentIcons.default}
                    </span>
                    <div>
                      <p className="font-medium">{employee?.department?.dep_name || 'N/A'}</p>
                      <p className="text-sm text-gray-600">Since {new Date(employee?.joiningDate).toLocaleDateString() || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="md:w-2/3 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
                    <FaUserTie className="mr-2 text-blue-600" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FaVenusMars className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium">{employee?.gender || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaBirthdayCake className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="font-medium">
                          {employee?.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaHeart className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Marital Status</p>
                        <p className="font-medium">{employee?.maritalStatus || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
                    <FaPhone className="mr-2 text-blue-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MdEmail className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{employee?.userId?.email || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaPhone className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{employee?.contactNumber || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">
                           {employee?.address || ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employment Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
                    <FaBriefcase className="mr-2 text-blue-600" />
                    Employment Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FaCalendarAlt className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Joining Date</p>
                        <p className="font-medium">
                          {employee?.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MdWorkHistory className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Years of Experience</p>
                        <p className="font-medium">{employee?.experience || '0'} years</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaGraduationCap className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Education</p>
                        <p className="font-medium">{employee?.education || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
                    <MdFamilyRestroom className="mr-2 text-blue-600" />
                    Emergency Contact
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FaUserTie className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Contact Person</p>
                        <p className="font-medium">{employee?.emergencyContact?.name || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaPhone className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{employee?.emergencyContact?.phone || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaHeart className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Relationship</p>
                        <p className="font-medium">{employee?.emergencyContact?.relationship || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Additional Information</h3>
                <p className="text-gray-700">
                  {employee?.additionalInfo || 'No additional information provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;