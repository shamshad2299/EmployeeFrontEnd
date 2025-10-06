import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../Store/authContext";
import { useNavigate } from "react-router-dom";
import { AllApi } from "../CommonApiContainer/AllApi";
import Loader from "../components/Loader";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
 
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(`${AllApi.login.url}`, formData);
      if (response.data.success) {
        setLoading(false);
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
        setLoading(true);
        toast.error(response.data.message);
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return loading ? (
    <div className="w-full bg-yellow-200 flex justify-center items-center h-full">
      <Loader></Loader>
    </div>
  ) : (
    <div className="bg-gradient-to-b from-teal-600 from-50% to-gray-200 to-50% flex justify-center items-center space-y-6 flex-col w-full h-screen">
      <h1 className="font-Pacific text-3xl text-white">
        Employee management System
      </h1>
      <div className=" shadow-lg rounded-sm p-6 w-80 bg-white ">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="w-full text-red-500">{error} </p>}
        <form onSubmit={handleOnSubmit}>
          <div className="mb-4">
            <div className="">
              <label className="block text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                className="border w-full px-3 py-2"
                autoComplete="username"
                type="email"
                name="email"
                value={formData.email}
                placeholder="Enter your Email"
                onChange={handler}
              />
            </div>
            <div className="">
              <label className="block text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                className="border w-full px-3 py-2"
                autoComplete="current-password"
                type="password"
                name="password"
                value={formData.password}
                placeholder="******************"
                onChange={handler}
              />
            </div>
            <div
              className="flex mb-4 items-center justify-between mt-4"
              onClick={() => navigate("/signup")}
            >
              <label
                htmlFor="checkbox"
                className="form-checkbox inline-flex items-center"
              >
                <input type="checkbox" />
                <span className="ml-2 text-teal-700 cursor-pointer">
                  Sign up
                </span>
              </label>
              <a className="text-teal-800" href="#">
                Forgot Password?
              </a>
            </div>
            <div className="mb-4">
              <button className="bg-teal-600 w-full py-2 text-white cursor-pointer hover:bg-amber-600 font-bold rounded-sm">
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
