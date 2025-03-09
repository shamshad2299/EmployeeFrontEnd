import React, { useEffect, useState } from "react";
import { useAuth } from "../Store/authContext";
import AddEmployee from "../components/Employee/AddEmployee";
import { Link, useNavigate, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { columns, DepartmentsButton } from "./utils/DepartmentsHelper";
import { EmployeeButton, employeeColumns } from "./utils/EmployeeHelper";
import { toast } from "react-toastify";
import axios from "axios";


//employee for sallary form
export const getEmployee = async(id)=>{
 
  let employees;
  try {
    const responce = await axios.get(`http://localhost:3000/api/getemployeeby-depId/${id}`,{
      headers : {
        Authorization : `Bearer ${localStorage.getItem("token")}`
      }
    })

   // 
    if(responce?.data?.success){
      employees = responce?.data;
   
     
    }
    return employees;
  } catch (error) {
    console.log(error)
  }

}

const EmployeeDashboard = () => {
  const [data , setData] = useState([{
    image : "my-Image",
    name : "shamshad Ahamad",
    dob : "20/04/2002",
    dep_name : "Computer",
    id : 1,
    description : "I am the student of Computer science and engineering "
  }]);
  const[emLoading , setEmLoading] = useState(false);
  const[employees , setEmployees] = useState( );
 const[filterEmployees , setFilterEmployees] = useState( );

const handleClick = ()=>{
 navigate(`/admin/viewemployee/${id}`)
} 

  const fetchDataResponce = async () => {
    try {
      setEmLoading(true);
      const getEmployeeData = await axios.get(
        "http://localhost:3000/api/get-employee",{
          headers : {
            "Authorization" : `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      
      if(getEmployeeData.data.success){
     
        let sno = 1;
        const finalData = await getEmployeeData.data.employees.map((emp)=>({

          id : emp._id,
          image :<img width={30} height={30} className="rounded-full" src={`http://localhost:3000/${emp.userId.profilePic}`}  onClick={handleClick}/>,
         sno : sno++,
         name : emp.userId.name,
         dob :new Date(emp.dob).toLocaleDateString() ,
         dep_name : emp.department.dep_name,
         action : <EmployeeButton id={emp._id} className="bg-red-700 pr-20"/>

        }))
        setEmployees(finalData)
        setFilterEmployees(finalData)
      }
     
    } catch(error){
      console.log(error)
    } finally{
      setEmLoading(false);
    }
  }

useEffect(()=>{
fetchDataResponce();
},[])



  const handleChange = (e)=>{

    const records = employees.filter((emp)=>
      emp.name.toLowerCase().includes(e.target.value.toLowerCase())
    )
    
    setFilterEmployees(records)
    
      }

  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    emLoading ? <div>Loading........</div> : <div className="p-6">
      <div>
        <div>
          <div className="text-2xl font-bold flex justify-center items-center  pt-6 ">
            Manage Employees
          </div>
          <div className="flex justify-between mr-4 pt-6">
            <input
              type="text"
              placeholder="Search by employee id"
              className="px-2 py-0.5 border  ml-4"
              onChange={handleChange}
            />
            <Link
              to={"/admin/add-employees"}
              className="px-4 bg-teal-600 rounded-sm py-2 text-white font-md"
            >
              Add new Employee
            </Link>
          </div>

          <div className="mt-10 container max-w-[calc(88vw-100px)] mx-auto"></div>
        </div>
      <div className="">
      <DataTable   columns={employeeColumns}  data={filterEmployees} pagination/>
      </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
