import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import {
  columns,
  DepartmentsButton,
} from "../../pages/utils/DepartmentsHelper";
import axios from "axios";
import { AllApi } from "../../CommonApiContainer/AllApi";
import Loader from "../Loader";

const Deparments = () => {
  const [departments, setDepartments] = useState([]);
  const [filterDepartmentData, setFilterDepartmentData] = useState([]);
    const [loading , setLoading] = useState(false);

  // delete departments

  const fetchDataResponce = async () => {
    try {
      setLoading(true);
      const getDepartmentRes = await axios.get(
        `${AllApi.getDepartment.url}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }

      );

      if (getDepartmentRes.data.sucess) {
        // setDepartments(getDepartmentRes.data.data);
        let sno = 1;
        const finalData = await getDepartmentRes.data?.data?.map((dep) => ({
          id: dep._id,
          sno: sno++,
          dep_name: dep.dep_name,
          action: (
            <DepartmentsButton
              id={dep._id}
              handleDeleteDepartment={handleDeleteDepartment}
            />
          ),
        }));
        setDepartments(finalData);
        setFilterDepartmentData(finalData);
      }
      else{
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally{
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchDataResponce();
  }, []);

  const handleDeleteDepartment = (id) => {
    const data = departments.filter((val) => val._id !== id);
    setDepartments(data);
    fetchDataResponce();
  };

  const filterDepartment = (e) => {
    const records = departments.filter((dep) =>
      dep.dep_name.toLowerCase().includes(e.target.value.toLowerCase())
    );

    setFilterDepartmentData(records);
  };

  return (
   loading ? <div className="w-full bg-yellow-200 flex justify-center items-center h-full"><Loader/></div>:  <div>
      <div className="text-2xl font-bold flex justify-center items-center pt-6 ">
        Manage Departments
      </div>
      <div className="flex sm:justify-between mr-4 pt-6 max-sm:flex-col max-sm:gap-10 max-sm:w-full max-sm:items-center">
        <input
          type="text"
          placeholder="Search by dep name"
          className="px-2 py-0.5 border  ml-4"
          onChange={filterDepartment}
        />
        <Link
          to={"/admin/add-departments"}
          className="px-4 bg-teal-600 rounded-sm py-2 text-white font-md"
        >
          Add new Department
        </Link>
      </div>

      <div className="mt-10 container max-w-[calc(80vw-100px)] mx-auto">
        <DataTable columns={columns} data={filterDepartmentData} pagination  className="bg-red-500"/>
      </div>
    </div>
  );
};

export default Deparments;
