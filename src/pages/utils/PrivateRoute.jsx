import React from 'react'
import { useAuth } from '../../Store/authContext'
import { Navigate } from 'react-router-dom';
import Loader from '../../components/Loader';

const PrivateRoute = ({children}) => {

  const {user , loading} = useAuth();

  if(loading){
    return <div className='w-full  flex justify-center items-center h-screen'><Loader></Loader></div>
  }

  return user ? children : <Navigate to ="/login" />
}

export default PrivateRoute