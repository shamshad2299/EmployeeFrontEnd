import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../Store/authContext";
import { useNavigate } from "react-router-dom";

const Setting = () => {
  const { user = {} } = useAuth(); // Default to an empty object
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [passwords, setPassword] = useState({
    userId: user?._id,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  

  useEffect(() => {
    if (user?._id) {

     setPassword({
      userId : user?._id,
     })
    
    }
  }, [user]);
  
  
  if (!passwords) {
    return <div>Loading...</div>; // Render a loading state until user is available
  }

 const handleChange = (e)=>{
  const { name , value} = e.target;

  setPassword((prev)=>({
    ...prev,
    [name] : value,
  }))
 }

//finally submission
  const handleOnSubmit = async (e) => {
    e.preventDefault();
  if(passwords.newPassword !== passwords.confirmPassword){
    setError("password does not match")
  }
  else {
  try {

    const responce  = await axios.put("http://localhost:3000/api/setting" , passwords ,{
      headers : {
        Authorization : `Bearer ${localStorage.getItem("token")}`
      }
    })
    console.log(responce)
   if(responce?.data?.success){

    if(responce?.data?.data?.role == "ADMIN"){
      navigate("/admin");
    }
    else{
      navigate("/employee-dashboard");
    }
   
    toast("password updated successfully")
   }
    
  } catch (error) {
    
  }
  }
  
  };


  return (
    <div className="bg-gradient-to-b from-gray-300 from-50% to-teal-600 to-50% flex justify-center items-center  flex-col w-full h-full shadow-md ">
      <div className=" shadow-lg rounded-sm p-6 lg:w-100 bg-white">
        <h1 className="font-Pacific text-2xl pb-4  font-bold">
          Change Password
        </h1>
        {error ? <p className="w-full text-red-500">{error} </p> : null}
        <form onSubmit={handleOnSubmit}>
          <div className="pb-4">
            <div className="pt-4">
            <input 
                    type="text" 
                   name="username"
                   autoComplete="username"
                   style={{ display: 'none' }}
/>
              <label className="block text-gray-700" htmlFor="oldPassword">
                Old Password
              </label>
              <input
              onChange={handleChange}
                className="border-2 my-1 w-full px-3 py-2 rounded-md border-gray-500 "
                type="password"
                placeholder="Enter your old Password"
                name="oldPassword"
                autoComplete="current-password"

              />
            </div>
            <div className="pt-4">
              <label className="block text-gray-700" htmlFor="password">
                new Password
              </label>
              <input
                onChange={handleChange}
                className="border-2 my-1 w-full px-3 py-2 rounded-md border-gray-500 "
                type="password"
                placeholder="******************"
                name="newPassword"
                autoComplete="new-password"

              />
            </div>
            <div className="pt-4 pb-4">
              <label className="block text-gray-700" htmlFor="password">
                confirm Password
              </label>
              <input
                onChange={handleChange}
                className="border-2 my-1 w-full px-3 py-2 rounded-md border-gray-500 "
                type="password"
                placeholder="******************"
                name="confirmPassword"
                autoComplete="new-password"

              />
            </div>

            <div className="mb-4">
              <button className="bg-teal-600 w-full py-2 text-white cursor-pointer hover:bg-amber-600 font-bold rounded-sm">
                Change Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Setting;
