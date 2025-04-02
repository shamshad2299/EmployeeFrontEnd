import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AllApi } from '../../CommonApiContainer/AllApi';
import { useAuth } from '../../Store/authContext';
import Loader from '../Loader';

const EmployeeProfile = () => {
  const [employee, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams(); // Get the id from the URL
  const {user} = useAuth();

  useEffect(() => {
    const ViewEmployees = async () => {
      try {
        setLoading(true);
        const getData = await axios.get(`${AllApi.viewEmployee.url}/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        
        if (getData?.data?.success) {
          setEmployees(getData.data.employee);
       
          if(getData.data.employee){
          
            toast.success(getData.data.message);
          }
          if(!getData.data.employee){
            toast.success("you are not an employee");

          }
       
        } else if (getData.data.error) {
          toast.error(getData.data.message);
          setSecondError(getData.data.message);
          setLoading(true)
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    ViewEmployees(); // Call the function to fetch employee data
  }, [user?._id]); // Run the effect when id changes

  return (
    <>
      {loading ? (
        <div className="w-full bg-yellow-200 flex justify-center items-center h-full"><Loader/></div>
      ) : employee ? (
        <div className="bg-slate-200 w-full h-screen flex justify-center items-center">
          <div className="container bg-white sm:w-[calc(65vw-100px)] w-75  sm:h-[calc(80vh-100px)] h-110 pt-12 shadow-sm rounded-md">
            <h3 className="w-fit text-2xl font-bold mx-auto mb-5">Employee Details</h3>
            <div className="flex justify-evenly items-center  max-sm:flex-col  max-sm:gap-10">
              <div className="bg-red-400 p-1 rounded-full">
                <img
                  className="rounded-full"
                  width={200}
                  src={`https://employee-backend-last.vercel.app/${employee?.userId?.profilePic}`}
                  alt="Profile"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex">
                  <p className="font-bold mb-3 p-1">Name:</p>
                  <span className="p-1 text-sm">{employee?.userId?.name}</span>
                </div>
                <div className="flex">
                  <p className="font-bold mb-3 p-1">Employee Id:</p>
                  <span className="p-1 text-sm">{employee?.employeeId}</span>
                </div>
                <div className="flex">
                  <p className="font-bold mb-3 p-1">Gender:</p>
                  <span className="p-1 text-sm">{employee?.gender}</span>
                </div>
                <div className="flex">
                  <p className="font-bold mb-3 p-1">Date of Birth:</p>
                  <span className="p-1 text-sm">
                    {new Date(employee?.dob).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex">
                  <p className="font-bold mb-3 p-1">Department:</p>
                  <span className="p-1 text-sm">{employee?.department?.dep_name}</span>
                </div>
                <div className="flex">
                  <p className="font-bold mb-3 p-1">Marital Status:</p>
                  <span className="p-1 text-sm">{employee?.maritalStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='bg-white text-2xl font-bold mt-10 py-5'><p className='text-center'>You are not an employee</p></div>
      )}
    </>
  );
};

export default EmployeeProfile;