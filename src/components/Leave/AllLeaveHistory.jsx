import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useParams } from 'react-router-dom';
import { leaveColumns } from '../../pages/utils/EmployeeHelper';
import { AllApi } from '../../CommonApiContainer/AllApi';
import Loader from '../Loader';

const AllLeaveHistory = () => {
  const {id} = useParams();
  const [leaveData , setLeaveData] = useState("");
  const [leaveFilter , setLeaveFilter] = useState("");
  const [loading , setLoading] = useState(false);

  useEffect(() => {
    const getLeaves = async()=>{
try {
setLoading(true)
     
  const responce = await axios.get(`${AllApi.getLeaveById.url}/${id}`,   {
    headers : {
      Authorization :`Bearer ${localStorage.getItem("token")}`
    }
  });


  if(responce?.data?.success){
 setLoading(false);
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
    setLoading(true);
  }
  
} catch (error) {
  console.log(error)
} finally{
  setLoading(false);
}
    
    }
 
    getLeaves();
  }, []);

  return (
    loading ?  <div className="w-full bg-yellow-200 flex justify-center items-center h-full"><Loader></Loader></div> : <div>
            <h3 className='text-2xl font-bold pt-5 text-center mb-12'>Manage Leave</h3>
      <div className='pl-5 pt-5 pr-4'><DataTable columns={leaveColumns }  data={leaveFilter} ></DataTable></div>
    </div>
  )
}

export default AllLeaveHistory