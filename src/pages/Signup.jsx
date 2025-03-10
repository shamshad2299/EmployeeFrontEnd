
// export default Signup;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {  useNavigate } from "react-router-dom";
import { AllApi } from "../CommonApiContainer/AllApi";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState("");
 



  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      const responce = await axios.post(
       "https://employee-backend-last.vercel.app/api/register", 
        { name ,email ,password}
      );

      setData(responce.data);
      
     //error handelling
      if(data.success){
        toast.success(data.message);
        Navigate("/login")
      }
      else if(data.error){
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //after Signup navigate to Login page
  const Navigate = useNavigate();
  const navigateTo =()=>{
    Navigate("/login")
  }
  return (
    <div className="bg-gradient-to-b from-teal-600 from-50% to-gray-200 to-50% flex justify-center items-center space-y-6 flex-col w-full h-screen">
      <h1 className="font-Pacific text-3xl text-white">
        Employee management System
      </h1>
      <div className=" shadow-lg rounded-sm p-6 w-80 bg-white ">
        <h2 className="text-2xl font-bold mb-4">SignUp</h2>
        {
        data.error
        }
        <form  onSubmit={handleOnSubmit}>
          <div className="mb-4">
            <div className="">
            <label className="block text-gray-700" htmlFor="name">
                Name
              </label>
              <input
                className="border w-full px-3 py-2"
                type="name"
                placeholder="Enter your Name"
                autoComplete="username"
                onChange={(e) => setName(e.target.value)}
              />
              <label className="block text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                className="border w-full px-3 py-2"
                type="email"
                placeholder="Enter your Email"
                  autoComplete="username"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="">
              <label className="block text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                className="border w-full px-3 py-2"
                type="password"
                placeholder="******************"
                  autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex mb-4 items-center justify-between mt-4">
              <label
                htmlFor="checkbox"
                className="form-checkbox inline-flex items-center"
              >
                <input type="checkbox" />
                <span className="ml-2 text-gray-700">Already Account</span>
              </label>
              <a className="text-teal-800" href="#" onClick={navigateTo}>
               Please Login
              </a>
            </div>
            <div className="mb-4">
              <button className="bg-teal-600 w-full py-2 text-white cursor-pointer hover:bg-amber-600 font-bold rounded-sm">
                SignUp
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
