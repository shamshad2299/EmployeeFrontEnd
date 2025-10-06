// components/common/LoadingSpinner.jsx
import PropTypes from 'prop-types';

const LoadingSpinner = ({ 
  fullPage = false,
  size = 'md',
  color = 'primary',
  text = '',
  textPosition = 'below',
  backdrop = true
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4'
  };

  // Color classes
  const colorClasses = {
    primary: 'border-t-teal-600 border-b-teal-600',
    secondary: 'border-t-gray-600 border-b-gray-600',
    white: 'border-t-white border-b-white',
    dark: 'border-t-gray-800 border-b-gray-800'
  };

  // Container classes
  const containerClasses = fullPage 
    ? `fixed inset-0 flex ${textPosition === 'right' ? 'flex-row' : 'flex-col'} items-center justify-center ${backdrop ? 'bg-white bg-opacity-75' : ''} z-50`
    : `flex ${textPosition === 'right' ? 'flex-row' : 'flex-col'} items-center justify-center`;

  // Text position classes
  const textClasses = textPosition === 'right' 
    ? 'ml-3' 
    : 'mt-3';

  return (
    <div className={containerClasses}>
      <div className={`animate-spin rounded-full border-transparent ${sizeClasses[size]} ${colorClasses[color]}`}></div>
      {text && (
        <span className={`text-${color === 'white' ? 'white' : 'gray-700'} ${textClasses}`}>
          {text}
        </span>
      )}
    </div>
  );
};

LoadingSpinner.propTypes = {
  fullPage: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'secondary', 'white', 'dark']),
  text: PropTypes.string,
  textPosition: PropTypes.oneOf(['below', 'right']),
  backdrop: PropTypes.bool
};

export default LoadingSpinner;