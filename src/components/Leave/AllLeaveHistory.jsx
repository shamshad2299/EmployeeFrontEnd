import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useParams } from 'react-router-dom';
import { leaveColumns } from '../../pages/utils/EmployeeHelper';
import { AllApi } from '../../CommonApiContainer/AllApi';
import Loader from '../Loader';
import { 
  FaCalendarAlt, 
  FaFilter, 
  FaSearch, 
  FaFileDownload,
  FaFileExcel,
  FaPrint,
  FaRegClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf
} from 'react-icons/fa';
import { MdPendingActions } from 'react-icons/md';
import LoadingSpinner from '../common/LoadingSpinner';
//import FilterComponent from './FilterComponent';

const AllLeaveHistory = () => {
  const { id } = useParams();
  const [leaveData, setLeaveData] = useState([]);
  const [leaveFilter, setLeaveFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  // Status badges with icons
  const statusBadges = {
    'Approved': {
      color: 'bg-green-100 text-green-800',
      icon: <FaCheckCircle className="mr-1" />
    },
    'Rejected': {
      color: 'bg-red-100 text-red-800',
      icon: <FaTimesCircle className="mr-1" />
    },
    'Pending': {
      color: 'bg-yellow-100 text-yellow-800',
      icon: <FaHourglassHalf className="mr-1" />
    }
  };

  useEffect(() => {
    const getLeaves = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${AllApi.getLeaveById.url}/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (response?.data?.success) {
          let sno = 1;
          const finalLeave = response?.data?.data?.map((data) => ({
            id: data._id,
            sno: sno++,
            leave: data?.leaveType,
            from: new Date(data?.startDate).toLocaleDateString(),
            to: new Date(data?.endDate).toLocaleDateString(),
            days: calculateLeaveDays(data.startDate, data.endDate),
            status: data?.status,
            description: data?.description,
            applied: new Date(data?.createdAt).toLocaleDateString(),
            actions: ''
          }));

          setLeaveData(finalLeave);
          setLeaveFilter(finalLeave);
        }
      } catch (error) {
        console.error("Error fetching leave data:", error);
      } finally {
        setLoading(false);
      }
    };

    getLeaves();
  }, [id]);

  const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const filteredItems = leaveData.filter(item =>
    (item.leave && item.leave.toLowerCase().includes(filterText.toLowerCase())) ||
    (item.status && item.status.toLowerCase().includes(filterText.toLowerCase())) ||
    (item.description && item.description.toLowerCase().includes(filterText.toLowerCase()))
  );

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search leaves..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
          {filterText && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FaFilter className="mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FaFileDownload className="mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FaPrint className="mr-2" />
            Print
          </button>
        </div>
      </div>
    );
  }, [filterText, resetPaginationToggle]);

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#f8fafc',
        borderTopWidth: '1px',
        borderTopColor: '#f1f5f9',
        fontWeight: 'bold',
        fontSize: '0.875rem',
      },
    },
    rows: {
      style: {
        minHeight: '60px',
        '&:not(:last-of-type)': {
          borderBottomWidth: '1px',
          borderBottomColor: '#f1f5f9',
        },
        '&:hover': {
          backgroundColor: '#f8fafc',
        },
      },
    },
    cells: {
      style: {
        paddingLeft: '16px',
        paddingRight: '16px',
      },
    },
  };

  const conditionalRowStyles = [
    {
      when: row => row.status === 'Approved',
      style: {
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
      },
    },
    {
      when: row => row.status === 'Rejected',
      style: {
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
      },
    },
    {
      when: row => row.status === 'Pending',
      style: {
        backgroundColor: 'rgba(234, 179, 8, 0.05)',
      },
    },
  ];

  const ExpandedComponent = ({ data }) => (
    <div className="p-4 bg-gray-50 rounded-lg my-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-700">Leave Details</h4>
          <p className="text-gray-600 mt-1">{data.description || 'No additional details provided'}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-700">Duration</h4>
          <p className="text-gray-600 mt-1">
            {data.days} day{data.days !== 1 ? 's' : ''} ({data.from} to {data.to})
          </p>
        </div>
      </div>
    </div>
  );

  const columns = [
    {
      name: 'S.No',
      selector: row => row.sno,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Leave Type',
      selector: row => row.leave,
      sortable: true,
    },
    {
      name: 'From',
      selector: row => row.from,
      sortable: true,
    },
    {
      name: 'To',
      selector: row => row.to,
      sortable: true,
    },
    {
      name: 'Days',
      selector: row => row.days,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      cell: row => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadges[row.status]?.color || 'bg-gray-100 text-gray-800'}`}>
          {statusBadges[row.status]?.icon || <MdPendingActions className="mr-1" />}
          {row.status}
        </span>
      ),
    },
    {
      name: 'Applied On',
      selector: row => row.applied,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800">
            View
          </button>
          {row.status === 'Pending' && (
            <button className="text-red-600 hover:text-red-800">
              Cancel
            </button>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <LoadingSpinner text="Loading Edited Employee Please wait..." size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-600" />
                  Leave History
                </h2>
                <p className="text-gray-600 mt-1">
                  View and manage all your leave applications
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  onClick={() => {/* Add new leave action */}}
                >
                  <FaRegClock className="mr-2" />
                  Apply New Leave
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <DataTable
              columns={columns}
              data={filteredItems}
              customStyles={customStyles}
              conditionalRowStyles={conditionalRowStyles}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 15, 20]}
              highlightOnHover
              pointerOnHover
              responsive
              subHeader
              subHeaderComponent={subHeaderComponentMemo}
              expandableRows
              expandableRowsComponent={ExpandedComponent}
              defaultSortFieldId={1}
              defaultSortAsc={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllLeaveHistory;