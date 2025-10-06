import React from "react";
import { Link } from "react-router-dom";
import { FiFolder } from "react-icons/fi";

const EmptyState = ({ title, description, actionText, actionLink }) => {
  return (
    <div className="text-center bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
        <FiFolder className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      <Link
        to={actionLink}
        className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm"
      >
        {actionText}
      </Link>
    </div>
  );
};

export default EmptyState;