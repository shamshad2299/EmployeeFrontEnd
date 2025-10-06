import React from 'react';

const ProgressBar = ({ percentage, color = 'bg-blue-500', className = '' }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div 
        className={`${color} h-2.5 rounded-full`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;