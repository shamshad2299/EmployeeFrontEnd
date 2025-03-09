import React, { useEffect } from 'react'
import { useAuth } from '../Store/authContext'
import { Navigate, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import NavBar from '../components/NavBar';
import { ROLE } from '../helper/RoleBase';



const AdminDashboard = () => {
  const navigate = useNavigate();
 
  const {user ,loading ,logout} = useAuth();

  //loading stage
  if(loading){
    return <div>Loading........</div>
  }
//  useEffect(()=>{
//   user?.role !== ROLE.ADMIN && navigate("/employee-dashboard");

//  } ,[user])
  //user not logged in
  if(!user ){
    navigate("/login")
  }
  return (
    <div className=''>
        <AdminSidebar/>
        <NavBar/>
    </div>
  )
}

export default AdminDashboard;