import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast} from "react-toastify"
import { AllApi } from '../../CommonApiContainer/AllApi';
import Loader from '../Loader';

const EditDepartment = () => {

  const navigate = useNavigate();
  const {id} = useParams();
  const [departments  , setDepartments] = useState([]);
  const[loading , setLoading] = useState(false);
  


  const handleOnChange =(e)=>{
 
    const {name , value} = e.target;
    setDepartments({...departments , [name] : value})

  }

  //Finding departments which is being edited
  const EditData = async()=>{
    try {
      setLoading(true);
      const fetchData = await axios.get(`${AllApi.getDepartmentById.url}/${id}` ,{
        headers : {
          Authorization : `Bearer ${localStorage.getItem("token")}`
        }
      });

    
      if(fetchData.data.success){
        setDepartments(fetchData?.data?.department);
        
      }
      else{
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
    } finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    EditData();
  },[])
  


  const handleOnSubmit =async(e)=>{

    e.preventDefault();
    try {
      setLoading(true);
      const fetchData = await axios.post(`${AllApi.editDepartment.url}/${id}`,departments ,{
        headers : {
          Authorization : `Bearer ${localStorage.getItem("token")}`
        }
      });
      if(fetchData.data.success){
        toast.success(fetchData.data.message);
        setDepartments(fetchData?.data?.department);
        navigate("/admin/departments");
  
      }
      if(fetchData.data.error){
        setLoading(false);
        toast.error(fetchData.data.message);

      }
    
    
    } catch (error) {
      console.log(error)
    } finally{
      setLoading(false);
    }
    

  }

  return (
    loading ?  <div className="w-full bg-yellow-200 flex justify-center items-center h-full"><Loader></Loader></div> :<div className="pt-20 bg-slate-200 h-full">

    <div className="bg-white mx-auto  max-w-3xl sm:w-96 w-75  p-10  shadow-2xl rounded">
      <h3 className="text-2xl font-medium text-center mb-10">Edit Department</h3>
      <div className="bg-white flex justify-center items-center ">
        
        <form onSubmit={handleOnSubmit}  className="flex flex-col gap-4">
          <div className="flex flex-col">
     
            <label htmlFor="dep_name" className="text-gray-700">Department Name</label>
            <input
             name="dep_name"
             onChange={handleOnChange}
              type="text"
             autoComplete='username'
              value={departments?.dep_name}
              placeholder="Enter Department name"
              className="border px-4 py-1 mt-1"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="description" className="text-gray-700">Description</label>
            <textarea
              name="description"
              className="border sm:w-80 w-65 h-25 mt-1"
              value={departments?.description}
              onChange={handleOnChange}
            ></textarea>
          </div>
          <button className="bg-teal-600 px-4 py-2 rounded font-medium text-white cursor-pointer">
            Edit Departmnet
          </button>
        </form>
      </div>
    </div>

  </div>
  )
}

export default EditDepartment