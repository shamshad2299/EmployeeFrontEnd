import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AllApi } from "../../CommonApiContainer/AllApi";
import Loader from "../Loader";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  //console.log(id)
  const [leaves, setLeaves] = useState([]);
 const  [loading , setLoading] = useState(false);


  const ViewLeaves = async () => {
    try {
      setLoading(true);
      const responce = await axios.get(
        `${AllApi.viewLeaves.url}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (responce?.data?.success) {
        setLoading(false);
        setLeaves(responce?.data?.leaves);
        toast.success(responce.data.message);
      }
      if (responce.data.error) {
        setLoading(true);
        toast.error(responce.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally{
        setLoading(false);
    }
  };

  useEffect(() => {
    ViewLeaves();
  }, []);

  const changeStatus = async (id , status)=>{
    try {
      setLoading(true)
      const responce = await axios.put(
        `${AllApi.changeLeaveStatus.url}/${id}`, {status},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      
     if (responce?.data?.success) {
      setLoading(false)
      //   setLeaves(responce?.data?.leaves);
          navigate("/admin/leaves")
        toast.success(responce.data.message);
     }
      if (responce.data.error) {
        setLoading(true)
        toast.error(responce.data.message);
      }
    } catch (error) {
     toast.error(error || "server error");
    } finally{
      setLoading(false)
    }
  }
  return (
    loading ?  <div className="w-full flex justify-center items-center h-full"><Loader></Loader></div> : <div className="bg-slate-200 w-full h-full  flex justify-center items-center">
      <div className="container bg-white w-[calc(65vw-100px)] h-[calc(80vh-100px)] pt-12 shadow-sm rounded-md">
        <h3 className="w-fit text-2xl font-bold mx-auto mb-10 ">
          Employee Details
        </h3>

        <div className="flex justify-evenly items-center ">
          <div className=" bg-gradient-to-b from-red-600 from-50% to-green-600 to-50% w-80 h-70 p-1 rounded-full">
            <img
              className="rounded-full w-full h-full"
              src={`https://employee-backend-last.vercel.app/${leaves?.employeeId?.userId?.profilePic}`}
              alt="employee-image"
            />
          </div>
          <div className="flex flex-col  ">
            <div className="flex">
              <p className="font-bold mb-1 p-1">Name : </p>{" "}
              <span className="p-1 text-lg text-teal-600 font-semibold">
                {leaves?.employeeId?.userId?.name}
              </span>
            </div>
            <div className="flex">
              <p className="font-bold mb-1 p-1">Employee Id : </p>{" "}
              <span className="p-1 text-lg text-teal-600 font-semibold">
                {leaves?.employeeId?.employeeId}
              </span>
            </div>
            <div className="flex">
              <p className="font-bold mb-1 p-1">Leave Type : </p>{" "}
              <span className="p-1 text-lg text-teal-600 font-semibold">
                {leaves?.leaveType}
              </span>
            </div>
            <div className="flex">
              <p className="font-bold mb-1 p-1">Reason : </p>{" "}
              <span className="p-1 text-lg text-teal-600 font-semibold">
                {leaves?.description}
              </span>
            </div>
            <div className="flex">
              <p className="font-bold mb-1 p-1">Department : </p>{" "}
              <span className="p-1 text-lg text-teal-600 font-semibold">
                {leaves?.employeeId?.department?.dep_name}
              </span>
            </div>
            <div className="flex">
              <p className="font-bold mb-1 p-1">Start date: </p>{" "}
              <span className="p-1 text-lg text-teal-600 font-semibold">
                {leaves?.startDate}
              </span>
            </div>
            <div className="flex">
              <p className="font-bold mb-1 p-1">End date: </p>{" "}
              <span className="p-1 text-lg text-teal-600 font-semibold">
                {leaves?.endDate}
              </span>
            </div>
            <div className="flex">
              <p className="font-bold mb-1 p-1">
                {leaves?.status === "pending" ? "Action" : "status"}:{" "}
              </p>{" "}
              <span className="p-1 text-lg text-teal-600 font-semibold">
                {leaves?.status === "pending" ? (
                  <div>
                    <button className="bg-green-600 text-white px-4 py-1 rounded-sm mr-4 cursor-pointer"
                    onClick={()=>changeStatus(leaves?._id , "accepted")}>
                      Accept
                    </button>
                    <button className="bg-red-600 text-white px-4 py-1 rounded-sm cursor-pointer"
                     onClick={()=>changeStatus(leaves?._id , "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <p className="p-1 text-lg text-teal-600 font-semibold">{leaves?.status}</p>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
