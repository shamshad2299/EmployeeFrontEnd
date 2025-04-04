import React, { useEffect, useState } from "react";
import {
  FaBuilding,
  FaCheckCircle,
  FaFileAlt,
  FaHourglassHalf,
  FaMoneyBillAlt,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";
import SummaryCard from "./Departments/SummaryCard";
import axios from "axios"
import { AllApi } from "../CommonApiContainer/AllApi";
import Loader from "./Loader";

const AdminSummary = () => {

  const [summary ,setSummary] = useState(null);
  const [loading , setLoading] = useState(false);
 

const getData = async()=>{
try {
  setLoading(true);
  const responce = await axios.get(`${AllApi.dashborad.url}` ,{
    headers : {
      Authorization : `Bearer ${localStorage.getItem("token")}`
     }
  })
  setSummary(responce.data);
  
} catch (error) {
  console.log(error)
} finally{
  setLoading(false);
}
}

useEffect(()=>{

  getData();
},[])


  return (
    loading ?  <div className="w-full bg-yellow-200 flex justify-center items-center h-full"><Loader></Loader></div> :  <div>
      <h3 className="p-8 font-serif text-2xl font-extrabold">
        Dashboard Overview
      </h3>
      <div className="flex flex-wrap justify-center">
        <SummaryCard
          msg={"Total Employee"}
          color={" bg-teal-600"}
   
          number={summary?.totalEmployees}
          icon={<FaUsers />}
        />
        <SummaryCard
          msg={"Total Deparments"}
          color={"bg-yellow-500 "}
          number={summary?.totalDepartments}
          icon={<FaBuilding />}
        />
        <SummaryCard
          msg={"Monthly Plan"}
          color={"bg-red-400 "}
          rup={"₹"}
          number={summary?.totalSalary}
          icon={<FaMoneyBillAlt />}
        />
      </div>
      <div>
        <h2 className="font-bold text-2xl text-center m-10">Leave Detail</h2>
      </div>

      <div className="flex flex-wrap mt-4 items-center justify-center  ">
        <div className="">
          <SummaryCard
            msg={"Leave Applied"}
            color={"bg-teal-600"}
            number={summary?.leaveSummary?.appliedFor}
            icon={<FaFileAlt />}
          />
          <SummaryCard
            msg={"Leave Pending"}
            color={"bg-yellow-600"}
            number={summary?.leaveSummary?.pending}
            icon={<FaHourglassHalf />}
          />
        </div>
        <div >
          <SummaryCard
            msg={"Leave Approved"}
            color={"bg-green-600"}
            number={summary?.leaveSummary?.approved}
            icon={<FaCheckCircle />}
          />
          <SummaryCard
            msg={"Leave Rejected"}
            color={"bg-red-600"}
            number={summary?.leaveSummary?.rejected}
            icon={<FaTimesCircle />}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
