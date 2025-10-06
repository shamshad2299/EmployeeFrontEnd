
import { 
  MdEmail, 
  MdPhone, 
  MdLocationOn, 
  MdPerson,
  MdEdit,
  MdVerifiedUser,
  MdFamilyRestroom
} from 'react-icons/md';
import { 
  FaBirthdayCake, 
  FaIdCard, 
  FaUserShield,
  FaHeartbeat,
  FaUserTag
} from 'react-icons/fa';

import { RiVerifiedBadgeFill } from 'react-icons/ri';

const PersonalInfo = () => {
const user  = JSON.parse(localStorage.getItem("userId"))

  // Enhanced personal information with more details
  const personalInfo = [
    { 
      icon: <MdPerson className="text-blue-500 text-xl" />, 
      label: 'Full Name', 
      value: user?.name,
      description: 'Your full legal name as per company records',
      verified: true
    },
    { 
      icon: <FaIdCard className="text-purple-500 text-xl" />, 
      label: 'Employee ID', 
      value: user?.employeeId || 'EMP-XXXX',
      description: 'Unique identifier for HR and payroll systems'
    },
    { 
      icon: <MdEmail className="text-red-500 text-xl" />, 
      label: 'Email', 
      value: user?.email,
      description: 'Primary communication channel for official correspondence',
      verified: true
    },
    { 
      icon: <MdPhone className="text-green-500 text-xl" />, 
      label: 'Phone', 
      value: user?.phone || '+1 (555) 000-0000',
      description: 'Mobile number for urgent communications'
    },
    { 
      icon: <FaBirthdayCake className="text-yellow-500 text-xl" />, 
      label: 'Date of Birth', 
      value: user?.dob ? new Date(user.dob).toLocaleDateString() : 'MM/DD/YYYY',
      description: 'Used for benefits and identity verification'
    },
    { 
      icon: <MdLocationOn className="text-indigo-500 text-xl" />, 
      label: 'Address', 
      value: user?.address || '123 Main St, City, Country',
      description: 'Current residential address for official records'
    },
  ];

  // Department information
  const departmentInfo = {
    icon: <FaUserTag className="text-blue-400 text-xl" />,
    name: user?.department || 'Not assigned',
    description: user?.department ? 
      `${user.department} department handles specialized operations` : 
      'You will be assigned to a department soon'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Personal Information</h1>
            <p className="text-blue-100">Your complete profile details and identification</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition text-black">
            <MdEdit className="mr-2" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Profile Summary */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex items-center md:w-1/3">
            <div className="relative mr-6">
              {user?.profilePic ? (
                <img
                  src={`http://localhost:5000/uploads/${user.profilePic}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center">
                  <MdPerson className="text-gray-400 text-4xl" />
                </div>
              )}
              <RiVerifiedBadgeFill className="absolute bottom-0 right-0 text-blue-500 bg-white rounded-full" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-gray-600">{user?.designation || 'Employee'}</p>
            </div>
          </div>

          {/* Department Info */}
          <div className="md:w-2/3 bg-blue-50 rounded-lg p-4 flex items-center">
            <div className="mr-4 p-3 bg-blue-100 rounded-full">
              {departmentInfo.icon}
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Department</h3>
              <p className="text-gray-600">{departmentInfo.dep_name}</p>
              <p className="text-sm text-gray-500 mt-1">{departmentInfo.description}</p>
            </div>
          </div>
        </div>

        {/* Personal Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {personalInfo.map((info, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center mb-3">
                  <div className="mr-3 p-2 bg-gray-100 rounded-full">
                    {info.icon}
                  </div>
                  <h3 className="font-medium text-gray-800">{info.label}</h3>
                </div>
                {info.verified && (
                  <span className="flex items-center text-xs text-blue-600">
                    <MdVerifiedUser className="mr-1" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-gray-700 text-lg font-semibold mb-2">{info.value}</p>
              <p className="text-sm text-gray-500">{info.description}</p>
            </div>
          ))}
        </div>

        {/* Emergency Contact Section */}
        <div className="bg-red-50 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FaHeartbeat className="text-red-500 mr-3" />
              Emergency Contact
            </h2>
            <button className="text-red-600 hover:text-red-800 flex items-center text-sm">
              <MdEdit className="mr-1" />
              Update
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <div className="mr-3 p-2 bg-red-100 rounded-full">
                  <MdPerson className="text-red-500 text-xl" />
                </div>
                <h3 className="font-medium text-gray-800">Contact Name</h3>
              </div>
              <p className="text-gray-700 text-lg font-semibold">
                {user?.emergencyContact?.name || 'Not provided'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Should be immediate family or close relative
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <div className="mr-3 p-2 bg-red-100 rounded-full">
                  <MdPhone className="text-red-500 text-xl" />
                </div>
                <h3 className="font-medium text-gray-800">Contact Number</h3>
              </div>
              <p className="text-gray-700 text-lg font-semibold">
                {user?.emergencyContact?.phone || 'Not provided'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                24/7 reachable number in case of emergencies
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm md:col-span-2">
              <div className="flex items-center mb-3">
                <div className="mr-3 p-2 bg-red-100 rounded-full">
                  <MdFamilyRestroom className="text-red-500 text-xl" />
                </div>
                <h3 className="font-medium text-gray-800">Relationship</h3>
              </div>
              <p className="text-gray-700 text-lg font-semibold">
                {user?.emergencyContact?.relationship || 'Not specified'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Nature of relationship with the emergency contact
              </p>
            </div>
          </div>
        </div>

        {/* Additional Security Section */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FaUserShield className="text-blue-500 mr-3" />
              Security & Verification
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-800 mb-3">Identity Verification</h3>
              <div className="flex items-center">
                <RiVerifiedBadgeFill className="text-green-500 text-2xl mr-3" />
                <div>
                  <p className="font-medium">Verified</p>
                  <p className="text-sm text-gray-500">Completed on 15 Jan 2023</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-800 mb-3">Two-Factor Authentication</h3>
              <div className="flex items-center">
                <div className="mr-3 p-2 bg-blue-100 rounded-full">
                  <MdVerifiedUser className="text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Active</p>
                  <p className="text-sm text-gray-500">SMS + Authenticator App</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;