import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../Store/authContext";
import { useNavigate } from "react-router-dom";
import { AllApi } from "../CommonApiContainer/AllApi";
import Loader from "../components/Loader";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Users,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [features, setFeatures] = useState([]);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Demo features for the EMS system
  useEffect(() => {
    setFeatures([
      {
        icon: <Users className="w-6 h-6" />,
        title: "Employee Management",
        description: "Manage your team efficiently",
      },
      {
        icon: <Shield className="w-6 h-6" />,
        title: "Secure Access",
        description: "Enterprise-grade security",
      },
      {
        icon: <TrendingUp className="w-6 h-6" />,
        title: "Performance Analytics",
        description: "Track and improve productivity",
      },
      {
        icon: <Clock className="w-6 h-6" />,
        title: "Time Tracking",
        description: "Monitor work hours seamlessly",
      },
    ]);
  }, []);

  const handler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${AllApi.login.url}`, formData);

      if (response.data.success) {
        toast.success(response.data.message);
        login(response.data.user);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", JSON.stringify(response.data.user));

        if (response.data.user.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/employee-dashboard");
        }
      }

      if (response.data.error) {
        toast.error(response.data.message);
        setError(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoAccounts = {
      admin: { email: "admin@ems.com", password: "admin123" },
      employee: { email: "employee@ems.com", password: "employee123" },
      manager: { email: "manager@ems.com", password: "manager123" },
    };
    if (role === "manager") {
      toast.info(
        "Manager dashboard is not ready yet. You will be redirected to the general dashboard. You can still submit employee requests.",
        {
        autoClose: 7000, // 7000ms = 7 seconds
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
      );
    }

    setFormData(demoAccounts[role]);
    toast.info(`Using ${role} demo credentials`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <LoadingSpinner text="Sign in Please wait..." size="lg" />
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
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              EMS Pro
            </h1>
          </div>

          <h2 className="text-4xl font-bold mb-6">
            Welcome to Your{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Workplace Hub
            </span>
          </h2>

          <div className="space-y-6 mb-8">
            <div className="flex items-center space-x-3 text-cyan-200">
              <CheckCircle className="w-5 h-5" />
              <span>Complete Employee Management Solution</span>
            </div>
            <div className="flex items-center space-x-3 text-cyan-200">
              <CheckCircle className="w-5 h-5" />
              <span>Real-time Analytics & Reporting</span>
            </div>
            <div className="flex items-center space-x-3 text-cyan-200">
              <CheckCircle className="w-5 h-5" />
              <span>Secure & Scalable Infrastructure</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="text-cyan-400 mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Demo Notice */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mt-8">
          <p className="text-yellow-200 text-sm">
            <strong>Demo Notice:</strong> Sign up or login with dummy data to
            explore all EMS functionalities including employee management,
            request systems, and analytics.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">EMS Pro</h1>
              </div>
              <p className="text-gray-300">
                Access your employee management dashboard
              </p>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2 hidden lg:block">
              Welcome Back
            </h2>
            <p className="text-gray-300 mb-8 hidden lg:block">
              Sign in to your EMS account
            </p>

            {/* Demo Login Buttons */}
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-3">Quick Demo Access:</p>
              <div className="grid grid-cols-3 gap-2">
                {["admin", "manager", "employee"].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleDemoLogin(role)}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 px-3 text-xs text-white transition-all duration-200 hover:scale-105"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleOnSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    autoComplete="username"
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter your email"
                    onChange={handler}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    placeholder="Enter your password"
                    onChange={handler}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{loading ? "Signing In..." : "Sign In"}</span>
                {!loading && (
                  <ArrowRight
                    className={`w-5 h-5 transition-transform ${
                      isHovered ? "translate-x-1" : ""
                    }`}
                  />
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer"
                >
                  Create account
                </button>
              </p>
            </div>

            {/* Mobile Notice */}
            <div className="lg:hidden mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
              <p className="text-cyan-200 text-sm text-center">
                <strong>Explore EMS:</strong> Use demo accounts to experience
                all features including employee requests and management tools.
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              🔒 Your data is securely encrypted and protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
