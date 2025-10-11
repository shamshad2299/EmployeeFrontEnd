import React, { useEffect } from "react";
import { useAuth } from "../../Store/authContext";
import { Navigate } from "react-router-dom";
import Loader from "../../components/Loader";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const RoleBaseRouter = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if(loading){
     return <div className='w-full flex justify-center items-center h-screen'><LoadingSpinner size='xl' fullPage color='dark'/></div>
   }

  if (!requiredRole.includes(user?.role)) {
    return <Navigate to="/employee-dashboard" />;
  }

  return user ? children : <Navigate to="/login" />;
};

export default RoleBaseRouter;
