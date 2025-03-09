import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { fetchDataResponce } from '../../pages/utils/EmployeeHelper';
import { toast } from 'react-toastify';

const EditEmployee = () => {
  
  const navigate = useNavigate();
  const {id} = useParams();
  const [departments  , setDepartments] = useState([]);
  const[loading , setLoading] = useState(false);
  const [formData , setFormData] = useState({
    name: "",
    employeeId: "",
    dob: "",
    role: "",
    gender: "",
    maritalStatus: "",
    address: "",
    department: "",
    salary: "",
  
  });

 
const hadleChange = (e)=>{
  const {name , value }  = e.target;
    setFormData((prev)=>({...prev , [name] :value}))
}

 //finding Departments

useEffect(()=>{

const getDepartments = async()=>{
  const newDep =  await fetchDataResponce();
setDepartments(newDep);

}
getDepartments();
},[])


//backed api call from this function on the basis of Id'
useEffect(()=>{
  const getPrviousData = async()=>{
    try {
  
      const getData = await axios.get(`http://localhost:3000/api/edit-employee/${id}`,{
        headers : {
          Authorization : `Bearer ${localStorage.getItem("token")}`
        }
      })
      //console.log(getData.data.success);
      if(getData?.data?.success){
        setFormData(getData?.data?.employee);
      }
      
    } catch (error) {
      console.log(error)
    }
  }
  getPrviousData();

},[])


//call the function to find previous data to be updated
  const handleSubmit =async(e)=>{

    e.preventDefault();
   
      try {
    
        const newEmployee = await axios.post(`https://employee-backend-last.vercel.app/api/finaledit-employee/${id}`,formData, {
          headers : {
            Authorization : `Bearer ${localStorage.getItem("token")}`
          }
        })
        //console.log(newEmployee.data);
    
        if(newEmployee.data.success){
          toast.success(newEmployee?.data?.message);
          setFormData(newEmployee.data.employee);
          navigate("/admin/employee-dashboard")
        }
        if(newEmployee?.data?.error){
          toast.error(newEmployee?.data?.message);
         
        }
        
      } catch (error) {
        toast.error(error);
      }
  
  }


  const inputDate = new Date(formData.dob).toLocaleDateString(); // Your input date
const parts = inputDate?.split("/"); // Split the date into parts
const formattedDate = `${parts[2]}-${parts[1]?.padStart(2, "0")}-${parts[0]?.padStart(2, "0")}`; // Format as yyyy-MM-dd



  return (
    <div>
        <div className="p-10">
      <div className="bg-white p-4 shadow-2xl rounded-md container overflow-x-scroll lg:overflow-auto">
        <h3 className="font-medium text-3xl font-sans p-4">Edit Employee</h3>
    <form  onSubmit={handleSubmit}>
    <div className="flex w-full max-w-98">
          <div className="flex flex-col">
            <label className="font-bold mt-6 text-sm ml-4 " htmlFor="em-name">
              Employee Name
            </label>
            <input
              className=" px-10 rounded-sm py-3 border lg:w-125 md:w-60 sm:w-40 ml-4 mt-2 "
              name="em-name"
              type="text"   
              value={formData?.userId?.name}
              placeholder="enter employee name"
              onChange={hadleChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-bold mt-6 text-sm ml-4 " htmlFor="employeeId">
              Employee Id
            </label>
            <input
              className=" px-10 rounded-sm py-3 border lg:w-125 md:w-60 sm:w-40 ml-4 mt-2"
              name="employeeId"
              type="text"
              value={formData?.employeeId}
              placeholder="enter email"
              onChange={hadleChange}
            />
          </div>
          
        </div>
        <div className="flex">
        
          <div className="flex flex-col">
            <label className="font-bold mt-6 text-sm ml-4 " htmlFor="dob">
              Employee DOB
            </label>
            <input
              className=" px-10 rounded-sm py-3 border lg:w-125 md:w-60 sm:w-40 ml-4 mt-2"
              name="dob"
              value={formattedDate}
              type="date"
              
              placeholder="enter employee id"
              onChange={hadleChange}
            />
          </div>
          <div className="flex">
          <div className="flex flex-col">
            <label className="font-bold mt-6 text-sm ml-4 " htmlFor="role">
              Role
            </label>
            <select name="role" id="role"
            onChange={hadleChange}
            value={formData?.userId?.role}
              className=" px-10 rounded-sm py-3 border lg:w-125 md:w-60 sm:w-40 ml-4 mt-2" >
              <option value="">Select role</option>
              <option value="ADMIN">Admin</option>
              <option value="GENERAL">General</option>
            </select>
        
          </div>
        
        </div>
        </div>

        <div className="flex">
          <div className="flex flex-col">
            <label className="font-bold mt-6 text-sm ml-4 " htmlFor="gender">
              Employee Gender
            </label>
            <select name="gender" id="gender" 
            onChange={hadleChange}
            value={formData?.gender}
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
            value={formData?.maritalStatus}
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
            value={formData?.address}
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
            value={formData?.department?.dep_name}
            className=" px-10 rounded-sm py-3 border lg:w-125 md:w-60 sm:w-40 ml-4 mt-2">
              <option value="select">Select Department</option>
              {departments?.map((dep)=><option key={dep?._id} value={dep?._id}>{dep?.dep_name}</option>)}
            </select>

          </div>
        </div>
        <div className="flex ">
          <div className="flex flex-col">
            <label className="font-bold mt-6 text-sm ml-4 " htmlFor="salary">
              Sallary{" "}
            </label>
            <input
            onChange={hadleChange}
            value={formData?.salary}
              className=" px-10 rounded-sm py-3 border lg:w-125 md:w-60 sm:w-40 ml-4 mt-2"
              name="salary"
              type="text"
              
              placeholder="enter sallary"
            />
          </div>
          
          
        </div>
       
        <button   className=" px-10 rounded-sm py-3 border lg:w-255 md:w-60 sm:w-40 ml-4  bg-teal-700 mt-10 font-bold text-white cursor-pointer ">Edit Employee</button>
    </form>
      </div>
    </div>
    </div>
  )
}

export default EditEmployee