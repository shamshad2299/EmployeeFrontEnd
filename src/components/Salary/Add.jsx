import React, { useEffect, useState } from "react";
import { fetchDataResponce } from "../../pages/utils/EmployeeHelper.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getEmployee } from "../../pages/EmployeeDashboard.jsx";
import { toast } from "react-toastify";
import { AllApi } from "../../CommonApiContainer/AllApi.js";

const Add = () => {
  //const {id} = useParams();
  const navigate = useNavigate();
  const [getDepartment, setDepartment] = useState();
  const [getEmployees, setEmployees] = useState();
  const [salary, setSalary] = useState({
    employeeId: null,
    salary: 0,
    deduction: 0,
    allowance: 0,
    payDate: null,
  });



  const handleChandge = (e) => {
    const { name, value } = e.target;
    setSalary((prev) => ({ ...prev, [name]: value }));
  };

  //for getting departments
  useEffect(() => {
    const department = async () => {
      const fetchDep = await fetchDataResponce();
      setDepartment(fetchDep);
    };
    department();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const salaryData = await axios.post(
        `${AllApi.addSalary.url}`,
        salary,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    
      if (salaryData.data.success) {
        toast.success(salaryData.data.message);
       navigate(`/admin/salary/${salaryData.data.data.employeeId}`);
       
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get employee by department id
  const handleEmployeeByDep = async (e) => {
    const emp = await getEmployee(e.target.value);
    setEmployees(emp?.data);
  };

  return (
    <>  
   <div className="bg-slate-300 h-full">
  <div className="p-10 ">
    <div className="bg-white p-4 shadow-2xl rounded-md lg:w-220  container mx-auto overflow-x-scroll lg:overflow-auto">
      <h3 className="font-medium text-3xl font-sans p-4">
        {" "}
        Add Employee Salary
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="flex  max-sm:flex-col  mx-w-98">
          <div className="flex flex-col">
            <label className="font-bold mt-6 text-sm ml-4 " htmlFor="name">
              Department
            </label>

            <select
              onChange={handleEmployeeByDep}
              name="department"
              id="department"
              className=" px-10 rounded-sm py-3 border lg:w-100 md:w-60 sm:w-40 ml-4 mt-2 "
            >
              <option value="">Select Department</option>
              {getDepartment?.map((dep) => (
                <option key={dep?._id} value={dep?._id}>
                  {dep?.dep_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label
              className="font-bold mt-6 text-sm ml-4 "
              htmlFor="employeeId"
            >
              Employee
            </label>
            <select
              onChange={handleChandge}
              name="employeeId"
              className=" px-10 rounded-sm py-3 border lg:w-100 md:w-60 sm:w-40 ml-4 mt-2 "
            >
              <option value="">Select Employees</option>
              {getEmployees?.map((emp) => (
                 <option key={emp?._id + Math.random(200)} value={emp?._id}>
                 {emp?.employeeId}
               </option> 
              ))}
            </select>
          </div>
        </div>
        <div className="flex  max-sm:flex-col">
          <div className="flex flex-col">
            <label className="font-bold mt-6 text-sm ml-4 " htmlFor="dob">
              basic Salary
            </label>
            <input
              onChange={handleChandge}
              className=" px-10 rounded-sm py-3 border lg:w-100 md:w-60 sm:w-40 ml-4 mt-2"
              name="salary"
              type="number"
              placeholder="enter salary"
            />
          </div>
          <div className="flex  max-sm:flex-col">
            <div className="flex flex-col">
              <label
                className="font-bold mt-6 text-sm ml-4 "
                htmlFor="role"
              >
                monthly Allownace
              </label>

              <input
                onChange={handleChandge}
                type="number"
                className=" px-10 rounded-sm py-3 border lg:w-100 md:w-60 sm:w-40 ml-4 mt-2"
                placeholder="monthly allowance"
                name="allowance"
              />
            </div>
          </div>
        </div>

        <div className="flex  max-sm:flex-col">
          <div className="flex flex-col">
            <label
              className="font-bold mt-6 text-sm ml-4 "
              htmlFor="gender"
            >
              Deductions
            </label>
            <input
              onChange={handleChandge}
              type="number"
              placeholder="deduction"
              name="deduction"
              className=" px-10 rounded-sm py-3 border lg:w-100 md:w-60 sm:w-40 ml-4 mt-2"
            />
          </div>
          <div className="flex flex-col">
            <label
              className="font-bold mt-6 text-sm ml-4 "
              htmlFor="maritalStatus"
            >
              pay Date
            </label>
            <input
              onChange={handleChandge}
              type="date"
              name="payDate"
              className=" px-10 rounded-sm py-3 border lg:w-100 md:w-60 sm:w-40 ml-4 mt-2"
            />
          </div>
        </div>

        <button className=" px-10 rounded-sm py-3 border lg:w-205 md:w-60 sm:w-40 ml-4  bg-teal-700 mt-10 font-bold text-white cursor-pointer ">
          add Salary
        </button>
      </form>
    </div>
  </div>
</div>
</>
  );
 
};

export default Add;
