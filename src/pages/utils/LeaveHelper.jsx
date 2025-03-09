import { useNavigate } from "react-router-dom";
export const leaveStatus = [
  {
    name: " S NO",
    selector: (row) => row.sno,
  
  },
  {
    name : "EMPLOYEEID",
    selector : (row)=>row.employeeId,
  },
  {
    name : "NAME",
    selector : (row)=>row.name,
  },
  
  {
    name: "LEAVE TYPE",
    selector: (row) => row.leave,
      
  },
  {
    name : "DEPARTMENT",
    selector : (row)=>row.department,
  },
  {
    name : "DAYS",
    selector : (row)=>row.days,
  },
 
  {
    name: " STATUS",
    selector: (row) => row.status,
    sortable: true,
  },
  {
    name : "ACTION",
    selector : (row)=>row.action,
  },
 
];

export const LeaveButton =({id})=>{
const navigate = useNavigate();

  const handleView =(id)=>{
    navigate(`/admin/leaves/${id}`)
  }

  return (
    <div className="">
      <button className='bg-teal-600 text-white px-4 py-2 font-bold rounded-md cursor-pointer'
      onClick={()=>handleView(id)}>View</button>
    </div>
  )
}