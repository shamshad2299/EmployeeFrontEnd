import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Signup from "./pages/Signup";
import { Bounce, ToastContainer } from "react-toastify";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import RoleBaseRouter from "./pages/utils/RoleBaseRouter.jsx";
import PrivateRoute from "./pages/utils/PrivateRoute.jsx";
import AdminSummary from "./components/AdminSummary.jsx";
import Deparments from "./components/Departments/Deparments.jsx";
import Setting from "./components/Setting.jsx";
import AddDepartment from "./components/Departments/AddDepartment.jsx";
import EditDepartment from "./components/Departments/EditDepartment.jsx";
import AddEmployee from "./components/Employee/AddEmployee.jsx";
import EditEmployee from "./components/Employee/EditEmployee.jsx";
import ViewEmployee from "./components/Employee/ViewEmployee.jsx";
//import Salary from "./components/Salary/Salary.jsx";
import Add from "./components/Salary/Add.jsx";
import ViewSalary from "./components/Salary/ViewSalary.jsx";
import Employee_Dashboard from "./components/EmployeeDashboard/Employee-Dashboard.jsx";
import EmployeeProfile from "./components/EmployeeDashboard/EmployeeProfile.jsx";
import LeaveList from "./components/Leave/LeaveList.jsx";
import RequestLeave from "./components/Leave/RequestLeave.jsx";
import LeaveTable from "./components/Leave/LeaveTable.jsx";
import Detail from "./components/Leave/Detail.jsx";
import AllLeaveHistory from "./components/Leave/AllLeaveHistory.jsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <RoleBaseRouter requiredRole={["ADMIN"]}>
                  <AdminDashboard />
                </RoleBaseRouter>
              </PrivateRoute>
            }
          >
            <Route index element={<AdminSummary />}></Route>
            <Route path="/admin/departments" element={<Deparments />}></Route>
            <Route path="/admin/leaves" element={<LeaveTable />}></Route>
            <Route path="/admin/leaves/:id" element={<Detail />}></Route>
            <Route path="/admin/all-leaves/:id" element={<AllLeaveHistory />}></Route>
            {/* <Route path="/admin/salary" element={<Salary />}></Route> */}
            <Route path="/admin/setting" element={<Setting />}></Route>
         
            <Route
              path="/admin/add-departments"
              element={<AddDepartment />}
            ></Route>
            <Route
              path="/admin/edit-department/:id"
              element={<EditDepartment />}
            ></Route>
            <Route
              path="/admin/employee-dashboard"
              element={<EmployeeDashboard></EmployeeDashboard>}
            ></Route>
            <Route
              path="/admin/add-employees"
              element={<AddEmployee></AddEmployee>}
            ></Route>
             <Route
              path="/admin/edit-employees/:id"
              element={<EditEmployee></EditEmployee>}
            ></Route>
             <Route
              path="/admin/view-employees/:id"
              element={<ViewEmployee></ViewEmployee>}
            ></Route>
             
             <Route path="/admin/salary/add" element={<Add />}></Route>
             <Route path="/admin/salary/:id" element={<ViewSalary />}></Route>

          </Route>
          <Route path="/signup" element={<Signup />}></Route>
     
          {/* employee Dashboard */}

          {/* routing for employee Dashboard */} 

        <Route path="/employee-dashboard"   element = {<Employee_Dashboard/>}>
          
          <Route path="/employee-dashboard/profile/:id" element= {<EmployeeProfile/>}></Route>
          <Route path="/employee-dashboard/leaves/:id" element= {<LeaveList/>}></Route>
          <Route path="/employee-dashboard/add-new-leave" element= {<RequestLeave/>}></Route>
          <Route path="/employee-dashboard/salary/:id" element={<ViewSalary />}></Route>
          <Route path="/employee-dashboard/setting" element={<Setting />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
}

export default App;
