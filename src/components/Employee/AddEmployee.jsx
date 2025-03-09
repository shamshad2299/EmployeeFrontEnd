import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchDataResponce } from "../../pages/utils/EmployeeHelper";
import axios from "axios";
import {toast} from "react-toastify"

const AddEmployee = () => {

  const navigate = useNavigate();
  
const [departments   , setDepartments] = useState([]);
const [formData , setFormData] = useState({});

//console.log(formData);

const hadleChange = (e)=>{
  const {name , value , files}  = e.target;
  if(name === "image"){
    setFormData((prev)=>({...prev , [name] : files[0]}))
  }
  else{
    setFormData((prev)=>({...prev , [name] :value}))
  }
}


//console.log(departments)
useEffect(()=>{

const getDepartments = async()=>{
  const newDep =  await fetchDataResponce();
setDepartments(newDep);

}
getDepartments();
},[])


const handleSubmit = async (e)=>{
  e.preventDefault();
const formDataObj = new FormData();

Object.keys(formData).forEach((key)=>{
  formDataObj.append(key , formData[key]);
})
  //backend Api call

  try {
    const responce = await axios.post("https://employee-backend-e7zs.vercel.app/api/add-employee",formDataObj ,{
      headers : {
      'Authorization' :`Bearer ${localStorage?.getItem('token')}`
      }
  });
  


     if(responce.data.success){
      toast.success(responce.data.message);
      navigate("/admin/employee-dashboard")
     }
     if(responce.data.error){
      toast.error(responce.data.message)
      //setError(responce.data.error);
     }
    
    
  } catch (error) {
    console.log(error)
  }
}

  return (
    <div className="p-10">
      <div className="bg-white p-4 shadow-2xl rounded-md container overflow-x-scroll lg:overflow-auto">
        <h3 className="font-medium text-3xl font-sans p-4">Add New Employee</h3>
    <form onSubmit={handleSubmit}>
    <div className="flex w-full max-w-98">
          <div className="flex flex-col">
            <label className="font-bold mt-6 text-sm ml-4 " htmlFor="name">
              Employee Name
            </label>
            <input
              className=" px-10 rounded-sm py-3 border lg:w-125 md:w-60 sm:w-40 ml-4 mt-2 "
              name="name"
              autoComplete="username"
              type="text"   
              placeholder="enter employee name"
              onChange={hadleChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-bold mt-6 text-sm ml-4 " htmlFor="email">
              Employee Email
            </label>
            <input
              className=" px-10 rounded-sm py-3 border lg:w-125 md:w-60 sm:w-40 ml-4 mt-2"
              name="email"
             autoComplete="username"
              type="email"
              placeholder="enter email"
              onChange={hadleChange}
            />
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col">
            <label className="font-bold mt-6 text-sm ml-4 " htmlFor="employeeId">
              Employee Id
            </label>
            <input
              className=" px-10 rounded-sm py-3 border lg:w-125 md:w-60 sm:w-40 ml-4 mt-2"
              name="employeeId"
              type="text"
             autoComplete="username"
              placeholder="enter employee id"
              onChange={hadleChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-bold mt-6 text-sm ml-4 " htmlFor="dob">
              Employee DOB
            </label>
            <input
              className=" px-10 rounded-sm py-3 border lg:w-125 md:w-60 sm:w-40 ml-4 mt-2"
              name="dob"
              type="date"
              autoComplete="username"       
              placeholder="enter employee id"
              onChange={hadleChange}
            />
          </div>
        </div>

        <div className="flex">
          <div className="flex flex-col">
            <label className="font-bold mt-6 text-sm ml-4 " htmlFor="gender">
              Employee Gender
            </label>
            <select name="gender" id="gender" 
            onChange={hadleChange}
            className=" px-10 rounded-sm py-3 border lg:w-125 md:w-60 sm:w-40 ml-4 mt-2">
              <option value="select">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="other">Other</option>
            </select>
           
          </div>
          <div className="flex flex-col">
            <label className="font-bold mt-6 text-sm ml-4 " htmlFor="maritalStatus">
              Marital status
            </label>
            <select name="maritalStatus" id="marriage"
            onChange={hadleChange}
            className=" px-10 rounded-sm py-3 border lg:w-125 md:w-60 sm:w-40 ml-4 mt-2">
              <option value="status">Select Status</option>
              <option value="married">married</option>
              <option value="non-married">not married</option>
            </select>

          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col">
            <label className="font-bold text-sm ml-4 mt-6" htmlFor="address">
              Address
            </label>
            <input
            onChange={hadleChange}
              className=" px-10 rounded-sm py-3 border lg:w-125 md:w-60 sm:w-40 ml-4 mt-2"
              name="address"
              type="text"
              
              placeholder=" address "
            />
          </div>
          <div className="flex flex-col">
            <label className="font-bold mt-6 text-sm ml-4 " htmlFor="department">
             Department
            </label>
            <select name="department" id="department"  
            onChange={hadleChange}
            className=" px-10 rounded-sm py-3 border lg:w-125 md:w-60 sm:w-40 ml-4 mt-2">
              <option value="select">Select Department</option>
              {departments.map((dep)=><option key={dep._id} value={dep._id}>{dep.dep_name}</option>)}
            </select>

          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col">
            <label className="font-bold mt-6 text-sm ml-4 " htmlFor="salary">
              Sallary{" "}
            </label>
            <input
            onChange={hadleChange}
              className=" px-10 rounded-sm py-3 border lg:w-125 md:w-60 sm:w-40 ml-4 mt-2"
              name="salary"
              type="text"
              autoComplete="username"      
              placeholder="enter sallary"
            />
          </div>
          <div className="flex flex-col">
            <label
              className="font-bold mt-6 text-sm ml-4 "
              htmlFor="password"
            >
              Password{" "}
            </label>
            <input
            onChange={hadleChange}
            autoComplete="current-password"
              className=" px-10 rounded-sm py-3 border lg:w-125 md:w-60 sm:w-40 ml-4 mt-2"
              name="password"
              type="password"
              placeholder="enter password"
            />
          </div>
          
        </div>
        <div className="flex">
          <div className="flex flex-col">
            <label className="font-bold mt-6 text-sm ml-4 " htmlFor="role">
              Role
            </label>
            <select name="role" id="role"
            onChange={hadleChange}
              className=" px-10 rounded-sm py-3 border lg:w-125 md:w-60 sm:w-40 ml-4 mt-2" >
              <option value="">Select role</option>
              <option value="ADMIN">Admin</option>
              <option value="GENERAL">General</option>
            </select>
        
          </div>
          <div className="flex flex-col">
            <label
              className="font-bold mt-6 text-sm ml-4 "
              htmlFor="image"
            >
            upload Image
            </label>
            <input
            onChange={hadleChange}
              className=" px-10 rounded-sm py-3 border lg:w-125 md:w-60 sm:w-40 ml-4 mt-2"
              name="image"
              type="file"
            />
          </div>
        </div>
        <button   className=" px-10 rounded-sm py-3 border lg:w-255 md:w-60 sm:w-40 ml-4  bg-teal-700 mt-10 font-bold text-white cursor-pointer ">Add Employee</button>
    </form>
      </div>
    </div>
  );
};

export default AddEmployee;
