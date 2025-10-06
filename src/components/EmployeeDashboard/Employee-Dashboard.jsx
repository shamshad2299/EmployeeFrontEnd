
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import EmployeeSideBar from "./EmployeeSideBar";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Bar } from 'react-chartjs-2';
// import faker from 'faker';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export const options = {
//   plugins: {
//     title: {
//       display: true,
//       text: 'Chart.js Bar Chart - Stacked',
//     },
//   },
//   responsive: true,
//   interaction: {
//     mode: 'index',
//     intersect: false,
//   },
//   scales: {
//     x: {
//       stacked: true,
//     },
//     y: {
//       stacked: true,
//     },
//   },
// };

// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

// export const data = {
//   labels,
//   datasets: [
//     {
//       label: 'Dataset 1',
//       data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//       backgroundColor: 'rgb(255, 99, 132)',
//       stack: 'Stack 0',
//     },
//     {
//       label: 'Dataset 2',
//       data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//       backgroundColor: 'rgb(75, 192, 192)',
//       stack: 'Stack 0',
//     },
//     {
//       label: 'Dataset 3',
//       data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//       backgroundColor: 'rgb(53, 162, 235)',
//       stack: 'Stack 1',
//     },
//   ],
// };

const Employee_Dashboard = () => {

  return (
    <div className="flex ">
      <EmployeeSideBar />
      <div className="lg:ml-7">
        <NavBar />
        <div className="bg-slate-200 h-screen lg:ml-65 pt-20 pl-4 lg:w-[calc(100vw-310px)] ">
          {/* render all the child components */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Employee_Dashboard;
