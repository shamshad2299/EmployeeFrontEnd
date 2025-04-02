import axios from "axios";
import React, { useState } from "react";
import { Alignment } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { AllApi } from "../../CommonApiContainer/AllApi";
import Loader from "../../components/Loader";

export const employeeColumns = [
  {
    name: " S NO",
    selector: (row) => row.sno,
    width : "70px"
  },
  {
    name: "Image",
    selector: (row) => row.image,
      width : "130px"
  },
  {
    name: "Name",
    selector: (row) => row.name,
      width : "150px",
      sortable : true,
  },
  {
    name: "DOB",
    selector: (row) => row.dob,
      width : "150px"
  },
  {
    name: " Department",
    selector: (row) => row.dep_name,
    sortable: true,
      width : "150px",

  },
  {
    name: " Action",
    selector: (row) => row.action,
  center : "true",
  },
];

export const salaryColumns = [
  {
    name: " S NO",
    selector: (row) => row.sno,
  
  },
  {
    name: "Emp Id",
    selector: (row) => row.employeeId,
      
  },
  {
    name: "Salary",
    selector: (row) => row.salary,
     
      sortable : true,
  },
  {
    name: "Allowance",
    selector: (row) => row.allowance,
      
  },
  {
    name: " Deduction",
    selector: (row) => row.deduction,
    sortable: true,
    

  },
  {
    name: " Total payAble",
    selector: (row) => row.payable,

  },
];
export const leaveColumns = [
  {
    name: " S NO",
    selector: (row) => row.sno,
  
  },
  {
    name: "LEAVE TYPE",
    selector: (row) => row.leave,
      
  },
  {
    name: "FROM",
    selector: (row) => row.from,
     
      sortable : true,
  },
  {
    name: "TO",
    selector: (row) => row.to,
      
  },
  {
    name: " DESCRIPTION",
    selector: (row) => row.description,
    sortable: true,
    

  },
  {
    name: " APPLIED DATE",
    selector: (row) => row.applied,

  },
  {
    name: " STATUS",
    selector: (row) => row.status,

  },
];


export const EmployeeButton = ({id}) => {
  const navigate = useNavigate();


  //view employee details
  const handleView =()=>{
  navigate(`/admin/view-employees/${id}`)
  }

  //edit employee detail
  const handleEdit = () => {
    navigate(`/admin/edit-employees/${id}`);
  };

 // view Employee salary
  const EmployeeSalary =()=>{
    navigate(`/admin/salary/${id}`);
  }
   const handleLeave =()=>{
    navigate(`/admin/all-leaves/${id}`)

   }
  return (
     <div className="flex gap-2 employee-button">
      <button className="border px-4 py-2 cursor-pointer bg-teal-600 text-white font-semibold rounded-md"
      onClick={handleView}
      >view</button>
      <button className="border px-4 py-2 cursor-pointer bg-yellow-600 text-white font-semibold rounded-md" onClick={handleEdit}>edit</button>
      <button className="border px-4 py-2 cursor-pointer bg-green-600 text-white font-semibold rounded-md" onClick={EmployeeSalary}>sallary</button>
      <button className="border px-4 py-2 cursor-pointer bg-red-600 text-white font-semibold rounded-md" onClick={handleLeave}>leave</button>
    </div>
  );
};


