import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AllApi } from "../../CommonApiContainer/AllApi";
import { useState } from "react";
import Loader from "../../components/Loader";



export const columns = [
  {
    name: " S NO",
    selector: (row) => row.sno,
  },
  {
    name: " Departments",
    selector: (row) => row.dep_name,
    sortable : true,
  },
  {
    name: " Action",
    selector: (row) => row.action,
  },
];

export const DepartmentsButton = ({ id, handleDeleteDepartment }) => {
  const navigate = useNavigate();
  const [loading , setLoading] = useState(false)

  const handleEdit = () => {
    navigate(`/admin/edit-department/${id}`);
  };

  const handleDelete = async (id) => {
const confirm = window.confirm(`Do you want to delete department ?`)

 if (confirm){
  try {
    setLoading(true)
    const responce = await axios.delete(
      `${AllApi.deleteDepartment.url}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (responce.data.success) {
      setLoading(false)
      toast.success(responce.data.message);
      handleDeleteDepartment(id);
      
    }
    if (responce.data.error) {
      setLoading(true)
      toast.error(responce.data.message);
     
    }
    

  } catch (error) {
    console.log(error)
  } finally{
    setLoading(false)
  }
};
 }

  return (
    loading ?  <div className="w-full  flex justify-center items-center h-full"><Loader ></Loader></div> :  <div className="w-full flex justify-center items-center max-sm:flex-col max-sm:gap-4 ">
      <button
        className=" px-6 py-1 rounded-md bg-teal-500 text-white font-semibold cursor-pointer"
        onClick={handleEdit}
      >
        Edit
      </button>
      <button
        className=" px-4 py-1 rounded-md bg-red-600 mx-2 text-white font-semibold cursor-pointer"
        onClick={() => handleDelete(id)}
      >
        Delete
      </button>
    </div>
  );
};
