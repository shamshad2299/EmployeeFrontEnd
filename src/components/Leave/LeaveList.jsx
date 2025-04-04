import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { leaveColumns } from '../../pages/utils/EmployeeHelper'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import {useAuth} from "../../Store/authContext"
import { toast } from 'react-toastify'
import { AllApi } from '../../CommonApiContainer/AllApi'
import Loader from "../../components/Loader"

const LeaveList = () => {
 
  const {user} = useAuth();
  const [color , setColor] = useState(null);
  const [loading , setLoading] = useState(false);
  const navigate = useNavigate();
  const [leaveData ,setLeaveData] = useState([
    {
sno : 1,
leave : "sick",
from : "20/11/2002",
to : "20/11/2002",
description : "high fever and flue ",
applied : "11/12/2002",
status : "approved",
    }
  ])
  const [leaveFilter , setLeaveFilter] = useState();

  useEffect(() => {
    const getLeaves = async()=>{
      if (!user) {
       return (
        <div><Loader/></div>
       )
      }
      const userId =  user?._id;
      if(!userId){
        setLoading(true);
        toast.error("userId is undifined");
      }

     try {
      setLoading(true);
      const responce = await axios.get(`${AllApi.getLeaveById.url}/${userId}`,   {
        headers : {
          Authorization :`Bearer ${localStorage.getItem("token")}`
        }
      });
  
      
      if(responce?.data?.success){
    setLoading(false)
      let sno = 1;
     const finalLeave = await responce?.data?.data?.map((data)=>({
      sno : sno++,
      leave :data?.leaveType,
      from : data?.startDate,
      to  : data?.endDate,
      status : data?.status, 
      description : data?.description,
      applied : new Date(data?.createdAt).toLocaleDateString()
  
     }))
  
      setLeaveData(finalLeave);
      setLeaveFilter(finalLeave)
  
      }
      
      else{
        setLoading(true)
      }
     } catch (error) {
      console.log(error);
      
     } finally{
      setLoading(false);
     }
    
    }
   
    getLeaves();
  }, [user]);
  

  const handlenavigate = ()=>{
  

    navigate("/employee-dashboard/add-new-leave");
  }

 const filterByStatus = (e)=>{
const leaves = leaveData.filter((leave)=>leave.status.toLowerCase().includes(e.target.value.toLowerCase())
)
setLeaveFilter(leaves);
 }
  return (
    loading ?  <div className="w-full bg-yellow-200 flex justify-center items-center h-full"><Loader></Loader></div> : <div>
    
      <h3 className='text-2xl font-bold pt-5 text-center'>Manage Leave</h3>
      <div className='flex lg:flex-row lg:gap-0 gap-5 flex-col  justify-between pl-5 pr-5 pt-10'>
        <input type="text" placeholder='Search by status' className='px-4 py-1 border-2 border-gray-300 rounded-md bg-white' onChange={filterByStatus}/>
        <button className='lg:px-4 lg:mx-0 lg:py-0 px-20 bg-teal-600  py-2 mx-auto text-white font-semibold rounded-md cursor-pointer' onClick={handlenavigate}>Add leave</button>
      </div>
   <div className='pt-5 pr-4'>
 { loading ? <div className=' w-full flex justify-center items-center'><Loader/></div> :  <DataTable columns={leaveColumns }  data={leaveFilter}></DataTable>}
   </div>
    </div>
  )
}

export default LeaveList