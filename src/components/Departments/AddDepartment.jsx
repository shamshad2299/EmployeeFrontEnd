import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom"

const AddDepartment = () => {
  const [errors , setError] = useState(null);
  const [departments  , setDepartments] = useState({
    dep_name : " ",
    description : " ",
  });

  const navigate = useNavigate()


  const handleOnChange =(e)=>{
 
    const {name , value} = e.target;
    setDepartments({...departments , [name] : value})

  }

  const handleOnSubmit = async(e)=>{
 e.preventDefault();


try {
  const responce = await axios.post("http://localhost:3000/api/department",departments ,{

    headers : {
    'Authorization' :`Bearer ${localStorage?.getItem('token')}`
    }
});

   if(responce.data.success){
    toast.success(responce.data.message);
    navigate("/admin/departments")
   }
   if(responce.data.error){
    toast.error(responce.data.message)
    setError(responce.data.error);
   }
  
  
} catch (error) {
  console.log(error)
}
   
  }
  return (
    <div className="pt-20">
      <div className="bg-white mx-auto  max-w-3xl w-96 rounded  p-10  shadow-2xl">
        <h3 className="text-2xl font-medium text-center mb-10">Add Department</h3>
        <div className="bg-white flex justify-center items-center ">
          
          <form onSubmit={handleOnSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              {errors && <p className="w-full text-red-600">{errors}</p>}
              <label htmlFor="dep_name" className="text-gray-700">Department Name</label>
              <input
               name="dep_name"
               onChange={handleOnChange}
               autoComplete="username"
               required
                type="text"
                placeholder="Enter Department name"
                className="border px-4 py-1 mt-1"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="description" className="text-gray-700">Description</label>
              <textarea
                name="description"
                className="border w-80 h-25 mt-1"
                onChange={handleOnChange}
              ></textarea>
            </div>
            <button className="bg-teal-600 px-4 py-2 rounded font-medium text-white cursor-pointer">
              Add Departmnet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;
