import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { salaryColumns } from '../../pages/utils/EmployeeHelper'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../Store/authContext';
import { AllApi } from '../../CommonApiContainer/AllApi';
import Loader from '../Loader';

const ViewSalary = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const {user} = useAuth();
  const [loading , setLoading] = useState(false);

  const [saleries , setSaleries] = useState([]);

const fetchSalary = async()=>{
  try {
    setLoading(true);
    const responce = await axios.get(`${AllApi.viewSalary.url}/${id}` ,{
      headers : {
        Authorization : `Bearer ${localStorage.getItem("token")}`
      }
    })
  
    if(responce.data.success){
      setLoading(false)
      let sno = 1
     const fianlSalary = await responce.data.salary.map((sal)=>({
      id : sal?._id,
      sno : sno++,
      salary : sal?.salary,
      deduction : sal?.deduction,
      payable : sal?.netSalary,
      allowance : sal?.allowance,
      employeeId : sal?.employeeId?.employeeId,
     }))
    setSaleries(fianlSalary)
    }
    else{
      setLoading(true)
    }
  } catch (error) {
    console.log(error)
  } finally {
    setLoading(false)
  }
} 

useEffect(()=>{
  fetchSalary();
},[])

const handleClick =()=>{
 navigate("/admin/salary/add")
}

  return (
    loading ?  <div className="w-full bg-yellow-200 flex justify-center items-center h-full"><Loader></Loader></div> :   <div>
      <h3 className='text-3xl font-semibold text-center pt-10 pb-10'>Salary History</h3>
      <div className='flex justify-between pr-10 pb-5'>
      {user?.role === "ADMIN" &&    <button className='ml-10 bg-teal-600 text-white font-bold px-8 py-1 rounded-md cursor-pointer'  onClick={handleClick}>Add Salary</button>} 
        <input className='border-2 border-slate-300 rounded-md px-4 py-1' type="text" placeholder='Search by employee Id ' /></div>
        { loading ? <div className=' w-full flex justify-center items-center'><Loader/> </div> : < DataTable columns={salaryColumns} data={saleries}></DataTable> }
    </div>
  )
}

export default ViewSalary