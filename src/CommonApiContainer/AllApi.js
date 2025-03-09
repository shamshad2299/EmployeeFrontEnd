const basicUrl  = "https://employee-backend-e7zs.vercel.app";

export const AllApi = {

  //Authentication pannel API calls
  register : {

    url : `${basicUrl}/register`,
    method : "post",
   
  },
  login : {

    url : `${basicUrl}/login`,
    method : "post",
   
  },
  verifyUser : {

    url : `${basicUrl}/verify-user`,
    method : "get",
   
  },

  //department end points API call

  department : {

    url : `${basicUrl}/department`,
    method : "post",
   
  },
  getDepartment : {

    url : `${basicUrl}/getdep`,
    method : "get",
   
  },
  getDepartmentById : {

    url : `${basicUrl}/get-department`,
    method : "get",
   
  },
  editDepartment : {

    url : `${basicUrl}/edit-department`,
    method : "post",
   
  },
  deleteDepartment : {

    url : `${basicUrl}/delete-dep`,
    method : "delete",
   
  },

//employee End points API call

  addEmployee : {

    url : `${basicUrl}/add-employee`,
    method : "post",
   
  },
  getEmployee : {

    url : `${basicUrl}/get-employee`,
    method : "get",
   
  },
  editEmployee : {

    url : `${basicUrl}/edit-employee`,
    method : "post",
   
  },
  finalEditEmployee : {

    url : `${basicUrl}/finaledit-employee`,
    method : "post",
   
  },
  viewEmployee : {

    url : `${basicUrl}/view-employee`,
    method : "get",
   
  },
  employeeSalary : {

    url : `${basicUrl}/employee/salary`,
    method : "post",
   
  },
  getEmployeeByDepId : {

    url : `${basicUrl}/getemployeeby-depId`,
    method : "get",
   
  },

  //salary API calls

    getSalary : {

    url : `${basicUrl}/employee/salary`,
    method : "get",
   
  },
  leaveApplied : {

    url : `${basicUrl}/leave/applied`,
    method : "post",
   
  },
  getLeaveById : {

    url : `${basicUrl}/getLeave`,
    method : "get",
   
  },
  getAllLeaves : {

    url : `${basicUrl}/leaves`,
    method : "get",
   
  },
  viewLeaves : {

    url : `${basicUrl}/view-leave`,
    method : "get",
   
  },
  changeLeaveStatus : {

    url : `${basicUrl}/change-status`,
    method : "put",
   
  },

  //change dynamic dashboard API calls
  viewLeaves : {

    url : `${basicUrl}/dashboard`,
    method : "get",
   
  },

  //Change Password API call end point
  changePassword : {

    url : `${basicUrl}/setting`,
    method : "put",
   
  },
}