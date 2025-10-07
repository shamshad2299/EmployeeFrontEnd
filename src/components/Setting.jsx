import axios from "axios";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../Store/authContext";
import { useNavigate } from "react-router-dom";
import { AllApi } from "../CommonApiContainer/AllApi";
import Loader from "./Loader";

const Setting = () => {
  const { user = {} } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const [passwords, setPassword] = useState({
    userId: user?._id || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password strength calculator
const calculatePasswordStrength = useCallback((password) => {
  if (!password) return 0;

  const len = password.length;
  let strength = 0;

  if (len <= 3) strength = 25;
  else if (len === 4) strength = 50;
  else if (len === 5) strength = 75; // or 76 if you want exact
  else if (len >= 6) strength = 100;

  return strength;
}, []);


  // Update password strength when new password changes
  useEffect(() => {
    if (passwords.newPassword) {
      setPasswordStrength(calculatePasswordStrength(passwords.newPassword));
    } else {
      setPasswordStrength(0);
    }
  }, [passwords.newPassword, calculatePasswordStrength]);

  useEffect(() => {
    if (user?._id) {
      setPassword(prev => ({
        ...prev,
        userId: user._id
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(null);
    
    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setError("All fields are required");
      return false;
    }
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New password and confirm password do not match");
      return false;
    }

    if (passwords.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (passwordStrength < 75) {
      setError("Password is too weak. Include uppercase, numbers, and special characters");
      return false;
    }

    return true;
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(AllApi.changePassword.url, passwords, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response?.data?.success) {
        toast.success("🎉 Password updated successfully!");
        
        // Clear form
        setPassword({
          userId: user?._id,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        // Navigate based on role
        setTimeout(() => {
          if (response?.data?.data?.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/employee-dashboard");
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Password change error:", error);
      const errorMessage = error.response?.data?.message || "Failed to update password. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 75) return "Medium";
    return "Strong";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      {/* Header Notice */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Welcome to EMS Portal</h3>
                <p className="text-blue-100 text-sm">
                  Experience our premium Employee Management System. Request employment, manage profiles, and more!
                </p>
              </div>
            </div>
            <button 
              onClick={() => navigate("/features")}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Explore Features
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Update Password</h1>
                <p className="text-emerald-100">Secure your account with a new password</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-red-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleOnSubmit} className="space-y-6">
              {/* Old Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    type={showPassword.oldPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                    name="oldPassword"
                    value={passwords.oldPassword}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("oldPassword")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword.oldPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      ) : (
                        <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                     </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    type={showPassword.newPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    name="newPassword"
                    value={passwords.newPassword}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("newPassword")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword.newPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      ) : (
                        <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </>
                    )}
                    </svg>
                  </button>
                </div>
                
                {/* Password Strength Meter */}
                {passwords.newPassword && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Password Strength:</span>
                      <span className={`font-semibold ${
                        passwordStrength < 40 ? 'text-red-500' : 
                        passwordStrength < 75 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    type={showPassword.confirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword.confirmPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      ) : (

                        <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Updating Password...</span>
                  </div>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>

          {/* Footer Notice */}
          <div className="bg-gray-50 border-t border-gray-200 p-4">
            <div className="text-center text-sm text-gray-600">
              <p>🔒 Your security is our priority. Use a strong, unique password.</p>
              <p className="mt-1">
                Need help? <a href="/support" className="text-teal-600 hover:text-teal-700 font-medium">Contact Support</a>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Features Notice */}
        <div className="mt-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20">
          <h3 className="font-bold text-lg text-gray-800 mb-3">🚀 Explore EMS Features</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <span>Employee Profiles</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Leave Management</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Attendance Tracking</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Performance Reviews</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Setting);