import React, { useEffect } from 'react'
import { useAuth } from '../Store/authContext'
import { Navigate, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import NavBar from '../components/NavBar';
import { ROLE } from '../helper/RoleBase';
import LoadingSpinner from '../components/common/LoadingSpinner';



const AdminDashboard = () => {
  const navigate = useNavigate();
 
  const {user ,loading ,logout} = useAuth();

   if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <LoadingSpinner text="Loading Admin Pannel Please wait..." size="lg" />
        </div>
      </div>
    );
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