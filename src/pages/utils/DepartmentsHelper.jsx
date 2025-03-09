import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

  //console.log(id)
  //edit department
  const handleEdit = () => {
    navigate(`/admin/edit-department/${id}`);
  };

  const handleDelete = async (id) => {
const confirm = window.confirm(`Do you want to delete department ?`)

 if (confirm){
  try {
    const responce = await axios.delete(
      `http://localhost:3000/api/delete-dep/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (responce.data.success) {
      toast.success(responce.data.message);
      handleDeleteDepartment(id);
      
    }
    if (responce.data.error) {
      toast.error(responce.data.message);
     
    }
    

  } catch (error) {}
};
 }

  return (
    <div className="w-full flex justify-center items-center ">
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
