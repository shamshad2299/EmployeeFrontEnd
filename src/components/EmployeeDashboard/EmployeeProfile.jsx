import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmployeeProfile = () => {

  const [employee , setEmployees] = useState([]);
  const [loading , setLoading] = useState(false);
  //console.log(employee);

  const {id} = useParams();
  if(!id || id == undefined){
    setLoading(true)
  }
  if (!id) {
    toast.error("User ID is undefined");
    return;
  }
  

  const  ViewEmployees = async()=>{
    try {
      setLoading(true)
      const getData = await axios?.get(`https://employee-backend-e7zs.vercel.app/view-employee/${id}`,{
        headers : {
          Authorization : `Bearer ${localStorage?.getItem("token")}`
        }
      });

   
      if(getData?.data?.success){
        setEmployees(getData?.data?.employee);
        toast.success(getData?.data?.message);
        setLoading(false);
      }
      if(getData.data.error){
        toast.error(getData?.data?.message);
      }
      
    } catch (error) {
     toast.error(getData?.data?.error);
    }  finally{
      setLoading(false);
  }
  }

  useEffect(()=>{
ViewEmployees();
  },[])
  return (
loading ? <div>Loading Please wait....</div>  : employee ? <div>
    <div className='bg-slate-200 w-full h-screen  flex justify-center items-center' >
    <div className='container bg-white w-[calc(65vw-100px)] h-[calc(80vh-100px)] pt-12 shadow-sm rounded-md'>
     <h3 className='w-fit text-2xl font-bold mx-auto mb-5 '>Employee Details</h3>
   
       <div className='flex justify-evenly items-center '>
       <div className='bg-red-400 p-1 rounded-full'><img className='rounded-full' width={200}  src={`http://localhost:3000/${employee?.userId?.profilePic}`} alt="" /></div>
      <div className='flex flex-col '>
      <div className='flex'><p className='font-bold mb-3 p-1'>Name : </p> <span className='p-1 text-sm'>{employee?.userId?.name}</span></div>
       <div className='flex'><p className='font-bold mb-3 p-1'>Employee Id : </p> <span className='p-1 text-sm'>{employee?.employeeId}</span></div>
       <div className='flex'><p className='font-bold mb-3 p-1'>gender : </p> <span className='p-1 text-sm'>{employee?.gender}</span></div>
       <div className='flex'><p className='font-bold mb-3 p-1'>Date of birth : </p> <span className='p-1 text-sm'>{new Date(employee?.dob).toLocaleDateString()}</span></div>
       <div className='flex'><p className='font-bold mb-3 p-1'>Department : </p> <span className='p-1 text-sm'>{employee?.department?.dep_name}</span></div>
       <div className='flex'><p className='font-bold mb-3 p-1'>Marital Status : </p> <span className='p-1 text-sm'>{employee?.maritalStatus}</span></div>
      </div>
     </div>
  
   </div>
  </div>
</div> 
: <div>You are not employee</div>
  )
}

export default EmployeeProfile