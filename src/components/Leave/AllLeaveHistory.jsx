import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useParams } from 'react-router-dom';
import { leaveColumns } from '../../pages/utils/EmployeeHelper';

const AllLeaveHistory = () => {
  const {id} = useParams();
  const [leaveData , setLeaveData] = useState("");
  const [leaveFilter , setLeaveFilter] = useState("");

  useEffect(() => {
    const getLeaves = async()=>{
   
      const responce = await axios.get(`https://employee-backend-e7zs.vercel.app/api/getLeave/${id}`,   {
        headers : {
          Authorization :`Bearer ${localStorage.getItem("token")}`
        }
      });
  
    
      if(responce?.data?.success){
    
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
    
    }
 
    getLeaves();
  }, []);

  return (
    <div>
            <h3 className='text-2xl font-bold pt-5 text-center mb-12'>Manage Leave</h3>
      <div className='pl-5 pt-5 pr-4'><DataTable columns={leaveColumns }  data={leaveFilter} ></DataTable></div>
    </div>
  )
}

export default AllLeaveHistory