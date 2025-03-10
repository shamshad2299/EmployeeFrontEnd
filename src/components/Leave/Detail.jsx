import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  //console.log(id)
  const [leaves, setLeaves] = useState([]);


  const ViewLeaves = async () => {
    try {
      const responce = await axios.get(
        `https://employee-backend-last.vercel.app/api/view-leave/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (responce?.data?.success) {
        setLeaves(responce?.data?.leaves);
        toast.success(responce.data.message);
      }
      if (responce.data.error) {
        toast.error(responce.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    ViewLeaves();
  }, []);

  const changeStatus = async (id , status)=>{
    try {
      const responce = await axios.put(
        `https://employee-backend-last.vercel.app/api/change-status/${id}`, {status},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      
     if (responce?.data?.success) {
      //   setLeaves(responce?.data?.leaves);
          navigate("/admin/leaves")
        toast.success(responce.data.message);
     }
      if (responce.data.error) {
        toast.error(responce.data.message);
      }
    } catch (error) {
     toast.error(error || "server error");
    }
  }
  return (
    <div className="bg-slate-200 w-full h-full  flex justify-center items-center">
      <div className="container bg-white w-[calc(65vw-100px)] h-[calc(80vh-100px)] pt-12 shadow-sm rounded-md">
        <h3 className="w-fit text-2xl font-bold mx-auto mb-10 ">
          Employee Details
        </h3>

        <div className="flex justify-evenly items-center ">
          <div className=" bg-gradient-to-b from-red-600 from-50% to-green-600 to-50% w-80 h-70 p-1 rounded-full">
            <img
              className="rounded-full w-full h-full"
              src={`http://localhost:3000/${leaves?.employeeId?.userId?.profilePic}`}
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
