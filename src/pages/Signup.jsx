
// export default Signup;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {  useNavigate } from "react-router-dom";
import { AllApi } from "../CommonApiContainer/AllApi";
import Loader from "../components/Loader";

const Signup = () => {
const [formData , setFormData] = useState({
  name : "",
  email : "",
  password : "",
})


  const [data, setData] = useState("");
 
const [loading , setLoading] = useState(false);



const handler =(e)=>{
 
  setFormData({...formData , [e.target.name]: e.target.value})

}
  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true)
      const responce = await axios.post(
       `${AllApi.register.url}`, 
        formData
      );

      setData(responce.data.data);
      
     //error handelling
      if(responce.data.success){
        setLoading(false)
        toast.success(responce.data.message);
        Navigate("/login")

      }
      else if(responce.data.error){
        toast.error(responce.data.message);
        setLoading(true)
      }
    } catch (error) {
      console.log(error);
    } finally{
      setLoading(false)
    }
  };

  //after Signup navigate to Login page
  const Navigate = useNavigate();
  const navigateTo =()=>{
    Navigate("/login")
  }
  return (
    loading ?  <div className="w-full bg-yellow-200 flex justify-center items-center h-screen"><Loader></Loader></div> :   <div className="bg-gradient-to-b from-teal-600 from-50% to-gray-200 to-50% flex justify-center items-center space-y-6 flex-col w-full h-screen">
      <h1 className="font-Pacific text-3xl text-white">
        Employee management System
      </h1>
      <div className=" shadow-lg rounded-sm p-6 w-80 bg-white ">
        <h2 className="text-2xl font-bold mb-4">SignUp</h2>
        <form  onSubmit={handleOnSubmit}>
          <div className="mb-4">
            <div className="">
            <label className="block text-gray-700" htmlFor="name">
                Name
              </label>
              <input
                className="border w-full px-3 py-2"
                type="name"
                name="name"
                placeholder="Enter your Name"
                autoComplete="username"
                onChange={(e)=>handler(e)}
              />
              <label className="block text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                className="border w-full px-3 py-2"
                type="email"
                name="email"
                placeholder="Enter your Email"
                  autoComplete="username"
                onChange={(e)=>handler(e)}
              />
            </div>
            <div className="">
              <label className="block text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                className="border w-full px-3 py-2"
                type="password"
                name="password"
                placeholder="******************"
                  autoComplete="current-password"
                onChange={(e)=>handler(e)}
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
