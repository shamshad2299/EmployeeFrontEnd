import React, { useEffect } from 'react'
import { useAuth } from '../../Store/authContext'
import { Navigate } from 'react-router-dom';

const RoleBaseRouter = ({children , requiredRole}) => {
 const {user , loading} = useAuth();

 if(loading){
  return <div>
    Loading........
  </div>
 }


  if(!requiredRole.includes(user?.role)){

    return <Navigate to="/employee-dashboard" />
   }


   return user ? children : <Navigate to ="/login" />
}

export default RoleBaseRouter;