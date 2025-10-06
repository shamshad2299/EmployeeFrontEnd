import React from "react";
import { FiBriefcase, FiUsers, FiCalendar } from "react-icons/fi";
import { Link } from "react-router-dom";

const DepartmentCard = ({ department, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-4 text-white">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-teal-100 bg-opacity-20 flex items-center justify-center mr-3">
            <FiBriefcase size={20} />
          </div>
          <h3 className="text-lg font-semibold">{department.dep_name}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <FiUsers className="mr-2" />
          <span>{department.employeeCount} employees</span>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {department.description || "No description available"}
        </p>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <Link
            to={`/admin/edit-department/${department.id}`}
            className="text-sm text-teal-600 hover:text-teal-800 font-medium"
          >
            View Details
          </Link>
          <button
            onClick={() => onDelete(department.id)}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentCard;