import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { LeaveButton, leaveStatus } from "../../pages/utils/LeaveHelper";
import axios from "axios"
import { AllApi } from "../../CommonApiContainer/AllApi";
import Loader from "../Loader";
const LeaveTable = () => {
  const [data, setData] = useState([
    {
      sno: 1,
      employeeId: "user786",
      name: "Shamshad",
      leave: "casual leave",
      department: "logistic",
      days: "5",
      status: "pending",
      action: <LeaveButton></LeaveButton>,
    },
  ]);
  const [filerData , setFilterData] = useState();
  const [loading , setLoading] = useState(false);

  const fetchDataResponce = async () => {
    try {
      setLoading(true)
      const responce = await axios.get(
       ` ${AllApi.getAllLeaves.url}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

    
      if (responce.data.success) {
        setLoading(false)
        let sno = 1;
        const finalData = await responce.data.leaves.map((leave) => ({
          id: leave._id,
          sno: sno++,
          employeeId: leave.employeeId.employeeId,
          name: leave.employeeId.userId.name,
          leave: leave.leaveType,
          department: leave.employeeId.department.dep_name,
          days:
            new Date(leave.endDate).getDate() -
            new Date(leave.startDate).getDate(),
          status: leave.status,
          action: <LeaveButton id={leave._id} className="bg-red-700 pr-20" />,
        }));


      setData(finalData);
      setFilterData(finalData);
      }
      else{
        setLoading(true)
      }

    } catch (error) {
      console.log(error);
    } finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchDataResponce();
  }, []);

  const filterChange =(e)=>{
    const newData = data.filter((leaves)=>
      leaves.employeeId.toLowerCase().includes(e.target.value.toLowerCase())
    );
  setFilterData(newData);
  }
  const handleFilterByButton =(status)=>{
    const newData = data.filter((leaves)=>
      leaves.status.toLowerCase().includes(status.toLowerCase())
    );
  setFilterData(newData);
  }

  return (
    loading ?  <div className="w-full bg-yellow-200 flex justify-center items-center h-full"><Loader></Loader></div> : <div>
      <h3 className="text-3xl font-semibold text-center pb-5 pt-5">
        Manage Leaves
      </h3>
      <div className="flex justify-between mr-10 ml-10  max-sm:flex-col  max-sm:gap-10">
        <input
          type="text"
          className="border-2 border-gray-400 px-2 py-1 rounded-md"
          placeholder="Search by employee Id"
          onChange={filterChange}
        />
        <div className="flex gap-4  max-sm:flex-col">
          <button className="bg-teal-600 text-white px-2 py-1 font-semibold rounded-md cursor-pointer"
          onClick={()=>handleFilterByButton("pending")}>
            Pending
          </button>
          <button className="bg-teal-600 text-white px-2 py-1 font-semibold rounded-md cursor-pointer"
             onClick={()=>handleFilterByButton("accepted")}>
            Approved
          </button>
          <button className="bg-teal-600 text-white px-2 py-1 font-semibold rounded-md cursor-pointer"
             onClick={()=>handleFilterByButton("rejected")}>
            Rejected
          </button>
        </div>
      </div>

      <div className="mt-8 ml-6 mr-6">
        <DataTable columns={leaveStatus} data={filerData}></DataTable>
      </div>
    </div>
  );
};

export default LeaveTable;
