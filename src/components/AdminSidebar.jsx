import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {FaBuilding, FaCalendarAlt, FaCogs, FaMoneyBillAlt, FaTachometerAlt ,FaUsers} from "react-icons/fa"


const AdminSidebar = () => {
  const [sideBar , setSideBar] = useState(false);

  const handleClick =()=>{
setSideBar(!sideBar);
  }

  return (
    <div>
      <div className={`w-8 h-8 absolute m-1 top-2 left-2 cursor-pointer z-4 lg:hidden block `} onClick={handleClick}>
          <div className=' bg-black w-8 h-1 m-1'></div>
          <div className=' bg-black w-8 h-1 m-1'></div>
          <div className=' bg-black w-8 h-1 m-1'></div>
       </div>
    <div className={`lg:w-60 lg:block ${sideBar ? "block " : "hidden"} z-3  h-screen sidebar  fixed`}>
      <h3 className='bg-teal-600 p-2 font-bold text-white font-serif lg:w-60 text-center h-14'> Employee MS</h3>
      <div className='admin-sidebar flex w-60 min-h-screen  '>
        <ul className='bg-cyan-950 text-white flex  flex-col gap-4 w-full font-bold font-serif rounded-sm '>
      
          <NavLink className= {({isActive})=> `${isActive ? "bg-teal-600" : ""}   p-2 ml-2 mr-2 rounded mt-1`} to={"/admin"} end>     <FaTachometerAlt/> Dashboard</NavLink>
       
          <NavLink className= {({isActive})=> `${isActive ? "bg-teal-600" : ""}   p-2 ml-2 mr-2 rounded mt-1`} to={"/admin/employee-dashboard"}>   <FaUsers/> Employees</NavLink>
         
          <NavLink className= {({isActive})=> `${isActive ? "bg-teal-600" : ""}   p-2 ml-2 mr-2 rounded mt-1`} to={"/admin/departments"}>  <FaBuilding/>Departments</NavLink>
        
          <NavLink className= {({isActive})=> `${isActive ? "bg-teal-600" : ""}   p-2 ml-2 mr-2 rounded mt-1`} to={"/admin/leaves"}>   <FaCalendarAlt/>Leaves</NavLink>
        
          <NavLink className= {({isActive})=> `${isActive ? "bg-teal-600" : ""}   p-2 ml-2 mr-2 rounded mt-1`} to={"/admin/salary/add"}>  <FaMoneyBillAlt/>Salary</NavLink>
        
          <NavLink className= {({isActive})=> `${isActive ? "bg-teal-600" : ""}   p-2 ml-2 mr-2 rounded mt-1`} to={"/admin/setting"}>  <FaCogs/>Setting</NavLink>
        </ul>
      </div>
    </div>
    </div>
  )
}

export default AdminSidebar

// import React, { useState } from 'react'
// import { NavLink } from 'react-router-dom'
// import {FaBuilding, FaCalendarAlt, FaCogs, FaMoneyBillAlt, FaTachometerAlt ,FaUsers} from "react-icons/fa"


// const AdminSidebar = () => {
//   const [sideBar , setSideBar] = useState(false);

//   const handleClick =()=>{
// setSideBar(!sideBar);
//   }

//   return (
//     <div>
//       <div className={`w-8 h-8 absolute m-1 top-2 left-2 cursor-pointer ${sideBar ? "hidden" : ""} lg:hidden block`} onClick={handleClick}>
//           <div className=' bg-black w-8 h-1 m-1'></div>
//           <div className=' bg-black w-8 h-1 m-1'></div>
//           <div className=' bg-black w-8 h-1 m-1'></div>
//        </div>
//     <div className={`lg:w-60 lg:block ${sideBar ? "block" : "hidden"}  h-screen sidebar  fixed`}>
//       <h3 className='bg-teal-600 p-2 font-bold text-white font-serif lg:w-60 text-center h-14'> Employee MS</h3>
//       <div className='admin-sidebar flex w-60 min-h-screen  '>
//         <ul className='bg-cyan-950 text-white flex  flex-col gap-4 w-full font-bold font-serif rounded-sm '>
      
//           <NavLink className= {({isActive})=> `${isActive ? "bg-teal-600" : ""}   p-2 ml-2 mr-2 rounded mt-1`} to={"/admin"} end>     <FaTachometerAlt/> Dashboard</NavLink>
       
//           <NavLink className= {({isActive})=> `${isActive ? "bg-teal-600" : ""}   p-2 ml-2 mr-2 rounded mt-1`} to={"/admin/employee-dashboard"}>   <FaUsers/> Employees</NavLink>
         
//           <NavLink className= {({isActive})=> `${isActive ? "bg-teal-600" : ""}   p-2 ml-2 mr-2 rounded mt-1`} to={"/admin/departments"}>  <FaBuilding/>Departments</NavLink>
        
//           <NavLink className= {({isActive})=> `${isActive ? "bg-teal-600" : ""}   p-2 ml-2 mr-2 rounded mt-1`} to={"/admin/leaves"}>   <FaCalendarAlt/>Leaves</NavLink>
        
//           <NavLink className= {({isActive})=> `${isActive ? "bg-teal-600" : ""}   p-2 ml-2 mr-2 rounded mt-1`} to={"/admin/salary/add"}>  <FaMoneyBillAlt/>Salary</NavLink>
        
//           <NavLink className= {({isActive})=> `${isActive ? "bg-teal-600" : ""}   p-2 ml-2 mr-2 rounded mt-1`} to={"/admin/setting"}>  <FaCogs/>Setting</NavLink>
//         </ul>
//       </div>
//     </div>
//     </div>
//   )
// }

// export default AdminSidebar


// import React, { useState } from 'react'
// import { NavLink } from 'react-router-dom'
// import {FaBuilding, FaCalendarAlt, FaCogs, FaMoneyBillAlt, FaTachometerAlt ,FaUsers} from "react-icons/fa"

// const AdminSidebar = () => {
//   const [sideBar, setSideBar] = useState(false);

//   const handleClick = () => {
//     setSideBar(!sideBar);
//   }

//   return (
//     <div>
//       <div className={`w-8 h-8 absolute m-1 top-2 left-2 cursor-pointer lg:hidden block ${sideBar ? 'rotate-45' : ''}`} onClick={handleClick}>
//         <div className={`bg-black w-8 h-1 m-1 ${sideBar ? 'rotate-45 absolute top-4 left-3' : ''}`}></div>
//         <div className={`bg-black w-8 h-1 m-1 ${sideBar ? 'hidden' : ''}`}></div>
//         <div className={`bg-black w-8 h-1 m-1 ${sideBar ? '-rotate-45 absolute top-4 left-3' : ''}`}></div>
//       </div>
//       <div className={`lg:w-60 lg:block ${sideBar ? 'block' : 'hidden'} sidebar fixed`}>
//         <h3 className='bg-teal-600 p-2 font-bold text-white font-serif lg:w-60 text-center h-14'> Employee MS</h3>
//         <div className='admin-sidebar flex w-60 min-h-screen '>
//           <ul className='bg-cyan-950 text-white flex flex-col gap-4 w-full font-bold font-serif rounded-sm '>
//             <NavLink className={({ isActive }) => `${isActive ? "bg-teal-600" : ""} p-2 ml-2 mr-2 rounded mt-1`} to={"/admin"} end>
//               <FaTachometerAlt /> Dashboard
//             </NavLink>
//             <NavLink className={({ isActive }) => `${isActive ? "bg-teal-600" : ""} p-2 ml-2 mr-2 rounded mt-1`} to={"/admin/employee-dashboard"}>
//               <FaUsers /> Employees
//             </NavLink>
//             <NavLink className={({ isActive }) => `${isActive ? "bg-teal-600" : ""} p-2 ml-2 mr-2 rounded mt-1`} to={"/admin/departments"}>
//               <FaBuilding /> Departments
//             </NavLink>
//             <NavLink className={({ isActive }) => `${isActive ? "bg-teal-600" : ""} p-2 ml-2 mr-2 rounded mt-1`} to={"/admin/leaves"}>
//               <FaCalendarAlt /> Leaves
//             </NavLink>
//             <NavLink className={({ isActive }) => `${isActive ? "bg-teal-600" : ""} p-2 ml-2 mr-2 rounded mt-1`} to={"/admin/salary/add"}>
//               <FaMoneyBillAlt /> Salary
//             </NavLink>
//             <NavLink className={({ isActive }) => `${isActive ? "bg-teal-600" : ""} p-2 ml-2 mr-2 rounded mt-1`} to={"/admin/setting"}>
//               <FaCogs /> Setting
//             </NavLink>
//           </ul>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AdminSidebar
