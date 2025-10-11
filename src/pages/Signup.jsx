import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AllApi } from "../CommonApiContainer/AllApi";
import Loader from "../components/Loader";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Users,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  Building,
  BadgeCheck,
  Sparkles
} from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [features, setFeatures] = useState([]);
  const navigate = useNavigate();

  // Demo features for the EMS system
  useEffect(() => {
    setFeatures([
      {
        icon: <Users className="w-6 h-6" />,
        title: "Team Management",
        description: "Manage your entire team in one place"
      },
      {
        icon: <TrendingUp className="w-6 h-6" />,
        title: "Performance Insights",
        description: "Real-time analytics and reports"
      },
      {
        icon: <Clock className="w-6 h-6" />,
        title: "Time Tracking",
        description: "Automated attendance and hours"
      },
      {
        icon: <Building className="w-6 h-6" />,
        title: "Department Management",
        description: "Organize by teams and departments"
      }
    ]);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[$@#&!]+/)) strength += 1;
    return strength;
  };

  const handler = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // Check password strength
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${AllApi.register.url}`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        toast.success("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (response.data.error) {
        toast.error(response.data.message);
        setErrors({ submit: response.data.message });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <LoadingSpinner text="Signup/Register Please wait..." size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Left Side - Features & Info */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 text-white">
        <div>
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              EMS Pro
            </h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-6">
            Join Your <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Workplace Revolution</span>
          </h2>
          
          <div className="space-y-6 mb-8">
            <div className="flex items-center space-x-3 text-emerald-200">
              <BadgeCheck className="w-5 h-5" />
              <span>Complete Employee Management Suite</span>
            </div>
            <div className="flex items-center space-x-3 text-emerald-200">
              <BadgeCheck className="w-5 h-5" />
              <span>Advanced Analytics & Reporting</span>
            </div>
            <div className="flex items-center space-x-3 text-emerald-200">
              <BadgeCheck className="w-5 h-5" />
              <span>Secure Enterprise-grade Platform</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-green-400/30 transition-all duration-300">
              <div className="text-green-400 mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Demo Notice */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mt-8">
          <p className="text-emerald-200 text-sm">
            <strong>🚀 Get Started Instantly:</strong> Create your account or use demo credentials to explore all EMS features including employee requests, management tools, and advanced analytics.
          </p>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 ">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">EMS Pro</h1>
              </div>
              <p className="text-gray-300">Create your employee management account</p>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2 hidden lg:block">Create Account</h2>
            <p className="text-gray-300 mb-8 hidden lg:block">Join thousands of teams managing their workforce efficiently</p>

            <form onSubmit={handleOnSubmit} className="space-y-6">
              {errors.submit && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-200 text-sm">{errors.submit}</p>
                </div>
              )}

              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    className={`w-full bg-white/5 border ${
                      errors.name ? 'border-red-500/50' : 'border-white/10'
                    } rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="Enter your full name"
                    onChange={handler}
                    required
                  />
                </div>
                {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    className={`w-full bg-white/5 border ${
                      errors.email ? 'border-red-500/50' : 'border-white/10'
                    } rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter your email"
                    onChange={handler}
                    required
                  />
                </div>
                {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    className={`w-full bg-white/5 border ${
                      errors.password ? 'border-red-500/50' : 'border-white/10'
                    } rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    placeholder="Create a strong password"
                    onChange={handler}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Password strength:</span>
                      <span className={`${
                        passwordStrength <= 2 ? 'text-red-400' : 
                        passwordStrength <= 3 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    className={`w-full bg-white/5 border ${
                      errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'
                    } rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    placeholder="Confirm your password"
                    onChange={handler}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                  required
                />
                <p className="text-sm text-gray-400">
                  I agree to the{" "}
                  <button type="button" className="text-green-400 hover:text-green-300">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button type="button" className="text-green-400 hover:text-green-300">
                    Privacy Policy
                  </button>
                </p>
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                disabled={loading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>{loading ? "Creating Account..." : "Create Account"}</span>
                {!loading && <ArrowRight className={`w-5 h-5 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-green-400 hover:text-green-300 font-semibold transition-colors"
                >
                  Sign in here
                </button>
              </p>
            </div>

            {/* Mobile Notice */}
            <div className="lg:hidden mt-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
              <p className="text-emerald-200 text-sm text-center">
                <strong>🌟 Experience Full Features:</strong> After signup, explore employee management, request systems, and advanced analytics tools.
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              🔒 Enterprise-grade security & encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;