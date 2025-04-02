
import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import {  useAuth } from "../Store/authContext";
import { useNavigate } from "react-router-dom";
import { AllApi } from "../CommonApiContainer/AllApi";
import Loader from "../components/Loader";

const Login = () => {
  
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [error , setError] = useState(null);
  const navigate = useNavigate();
  const [loading , setLoading] = useState(false);

  const {login} = useAuth();


  const handleOnSubmit = async (e) => {
  e.preventDefault();
    const values = {
      email:  email ,
      password:  password ,
    };
    try {
      setLoading(true)
      const responce = await axios.post(
    `${AllApi.login.url}`,
        values
      );

      // console.log(responce);

      if(responce.data.success){
        setLoading(false)
        toast.success(responce.data.message);
        
        login(responce.data.user);
        localStorage.setItem("token" ,responce.data.token );

        if(responce.data.user.role === "ADMIN"){
            navigate("/admin");
        }
        else{
          navigate("/employee-dashboard");
        }

        //console.log(responce.data.token)
      }
      if(responce.data.error){
        setLoading(true)
        toast.error(responce.data.message);
        setError(responce.data.message);
      }
    } catch (error) {
      setError(error.message)
      console.log(error);
      
    } finally{
      setLoading(false)
    }
   
 

  };
   return (
    loading ?  <div className="w-full bg-yellow-200 flex justify-center items-center h-full"><Loader></Loader></div> :  <div className="bg-gradient-to-b from-teal-600 from-50% to-gray-200 to-50% flex justify-center items-center space-y-6 flex-col w-full h-screen">
      <h1 className="font-Pacific text-3xl text-white">Employee management System</h1>
      <div className=" shadow-lg rounded-sm p-6 w-80 bg-white ">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {
         error && <p className="w-full text-red-500">{error} </p>
        }
        <form onSubmit={handleOnSubmit}>
        <div className="mb-4">
        <div className="">
            <label className="block text-gray-700" htmlFor="email">Email</label>
            <input className="border w-full px-3 py-2" autoComplete="username" type="email" placeholder="Enter your Email" onChange={(e)=>setEmail(e.target.value)} />
          </div>
          <div className="">
            <label className="block text-gray-700" htmlFor="password">Password</label>
            <input className="border w-full px-3 py-2" autoComplete="current-password" type="password" placeholder="******************"  onChange={(e)=>setPassword(e.target.value)}/>
          </div>
          <div className="flex mb-4 items-center justify-between mt-4"
            onClick={()=>navigate("/signup")}>
            <label htmlFor="checkbox" className="form-checkbox inline-flex items-center">
            <input type="checkbox" />
            <span className="ml-2 text-teal-700 cursor-pointer"
          
            >Sign up</span>
            </label>
           <a  className= "text-teal-800" href="#">Forgot Password?</a>
          </div>
          <div className="mb-4">
            <button className="bg-teal-600 w-full py-2 text-white cursor-pointer hover:bg-amber-600 font-bold rounded-sm">Login</button>
          </div>
        </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
