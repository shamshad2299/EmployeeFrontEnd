import React from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";


// Enhanced SummaryCard component
const SummaryCard = ({ 
  msg, 
  number, 
  icon, 
  color,
  rup, 
  description, 
  trend, 
  gradient = false, 
  compact = false 
}) => {

  const cardClass = gradient 
    ? `bg-gradient-to-r ${color} text-white rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl`
    : `bg-white text-gray-800 rounded-2xl shadow-sm border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg`;

  return (
    <div className={`p-6 ${cardClass} ${compact ? 'text-center' : ''}`}>
      <div className={`flex ${compact ? 'flex-col items-center' : 'justify-between'} gap-4`}>
        <div className={compact ? 'text-center' : ''}>
          <p className={`font-semibold ${gradient ? 'text-blue-100' : 'text-gray-600'} ${compact ? 'text-sm' : ''}`}>
            {msg}
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            {rup && (
              <span className={`text-2xl font-bold ${gradient ? 'text-white' : 'text-gray-900'}`}>
                {rup}
              </span>
            )}
            <span className={`${compact ? 'text-2xl' : 'text-3xl'} font-bold ${gradient ? 'text-white' : 'text-gray-900'}`}>
              {number || 0}
            </span>
          </div>
          {description && (
            <p className={`text-sm mt-1 ${gradient ? 'text-blue-100' : 'text-gray-500'}`}>
              {description}
            </p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend > 0 ? 'text-green-200' : 'text-red-200'}`}>
              {trend > 0 ? <FaArrowUp /> : <FaArrowDown />}
              <span>{Math.abs(trend)}% from last month</span>
            </div>
          )}
        </div>
        <div className={` ${gradient ? 'bg-gray-400 flex items-center bg-opacity-20' : 'bg-gray-100'} p-3 rounded-xl ${compact ? 'w-12 h-12 flex items-center justify-center' : ''}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
