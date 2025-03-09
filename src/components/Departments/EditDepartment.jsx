import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast} from "react-toastify"

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
      const fetchData = await axios.get(`http://localhost:3000/api/get-department/${id}` ,{
        headers : {
          Authorization : `Bearer ${localStorage.getItem("token")}`
        }
      });

    
      if(fetchData.data.success){
        setDepartments(fetchData?.data?.department);
        
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    EditData();
  },[])
  


  const handleOnSubmit =async(e)=>{

    e.preventDefault();
    try {
      const fetchData = await axios.post(`https://employee-backend-last.vercel.app/api/edit-department/${id}`,departments ,{
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
        toast.error(fetchData.data.message);
      }
    
    
    } catch (error) {
      console.log(error)
    }
    

  }

  return (
    <div className="pt-20 bg-slate-200 h-full">
      {loading ?  <div> Loading ......</div> : 
    <div className="bg-white mx-auto  max-w-3xl w-96  p-10  shadow-2xl rounded">
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
              className="border w-80 h-25 mt-1"
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
}
  </div>
  )
}

export default EditDepartment