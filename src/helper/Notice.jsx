import React, { useState, useEffect } from "react";
import { FaTimes, FaBell, FaInfoCircle, FaLightbulb, FaRocket } from "react-icons/fa";

const noticeTemplates = {
  employeeRequest: {
    id: 1,
    title: "Employee Request Submitted",
    message: "You have requested employee access. Please wait for confirmation. Once approved, you can access the full employee dashboard and grow your career here.",
    type: "info",
    icon: FaBell,
    autoShow: true,
  },
  websiteUpdate: {
    id: 2,
    title: "Website Update",
    message: "I'm continuously working to make this website more functional and user-friendly. Stay tuned for exciting new features!",
    type: "success",
    icon: FaRocket,
    autoShow: false,
  },
    settings: {
    id: 2,
    title: "Website Update",
    message: "Setting has only frontend I will create it dynamic soon , please stay update with us",
    type: "success",
    icon: FaRocket,
    autoShow: false,
  },
  tipReminder: {
    id: 3,
    title: "Pro Tip",
    message: "Remember to explore all sections of the site. Your feedback helps us improve your experience.",
    type: "warning",
    icon: FaLightbulb,
    autoShow: false,
  },
  welcomeBack: {
    id: 4,
    title: "Welcome Back!",
    message: "Great to see you again! Check out what's new since your last visit.",
    type: "success",
    icon: FaInfoCircle,
    autoShow: true,
  },
  newFeature: {
    id: 5,
    title: "New Feature Available",
    message: "We've added new dashboard analytics. Explore the insights section to discover more.",
    type: "info",
    icon: FaRocket,
    autoShow: true,
  }
};

const Notice = ({ type = "welcomeBack", onClose, autoShow = true, showDelay = 1000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const notice = noticeTemplates[type];

  // Auto show notice after delay
  useEffect(() => {
    if (autoShow) {
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, showDelay);

      return () => clearTimeout(showTimer);
    }
  }, [autoShow, showDelay]);

  // Auto-dismiss after 8 seconds when visible
  useEffect(() => {
    if (isVisible && !isExiting) {
      const dismissTimer = setTimeout(() => {
        handleClose();
      }, 8000);

      return () => clearTimeout(dismissTimer);
    }
  }, [isVisible, isExiting]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  const getStyles = () => {
    const baseStyles = "relative mx-auto max-w-2xl transform transition-all duration-300 ease-in-out";
    
    if (isExiting) {
      return `${baseStyles} scale-95 opacity-0 -translate-y-2`;
    }
    
    return `${baseStyles} scale-100 opacity-100 translate-y-0`;
  };

  const getCardStyles = () => {
    const styles = {
      info: "bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 shadow-lg shadow-blue-100/50",
      success: "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 shadow-lg shadow-green-100/50",
      warning: "bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 shadow-lg shadow-amber-100/50",
    };
    return styles[notice.type] || styles.info;
  };

  const getIconStyles = () => {
    const styles = {
      info: "bg-blue-100 text-blue-600",
      success: "bg-green-100 text-green-600",
      warning: "bg-amber-100 text-amber-600",
    };
    return styles[notice.type] || styles.info;
  };

  const IconComponent = notice.icon;

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-full px-4">
      <div className={getStyles()}>
        <div className={`${getCardStyles()} rounded-xl p-6 backdrop-blur-sm border border-white/50`}>
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 rounded-t-xl">
            <div 
              className={`h-full rounded-t-xl transition-all duration-8000 ease-linear ${
                notice.type === 'info' ? 'bg-blue-500' :
                notice.type === 'success' ? 'bg-green-500' : 'bg-amber-500'
              }`}
              style={{ animation: 'progress 8s linear forwards' }}
            />
          </div>

          <div className="flex items-start space-x-4">
            {/* Icon */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${getIconStyles()} flex items-center justify-center`}>
              <IconComponent className="text-lg" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {notice.title}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {notice.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

// Hook to use notice in components
export const useNotice = () => {
  const [currentNotice, setCurrentNotice] = useState(null);

  const showNotice = (type, delay = 1000) => {
    setCurrentNotice({ type, delay });
  };

  const hideNotice = () => {
    setCurrentNotice(null);
  };

  const NoticeComponent = currentNotice ? (
    <Notice 
      type={currentNotice.type} 
      onClose={hideNotice}
      showDelay={currentNotice.delay}
    />
  ) : null;

  return {
    showNotice,
    hideNotice,
    NoticeComponent
  };
};

// AutoNotice component for automatic display
export const AutoNotice = ({ type = "welcomeBack", showDelay = 1000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Notice 
      type={type} 
      onClose={() => setIsVisible(false)}
      autoShow={true}
      showDelay={showDelay}
    />
  );
};

export default Notice;