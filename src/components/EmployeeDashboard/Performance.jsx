
import { 
  FaChartLine, 
  FaStar, 
  FaMedal, 
  FaTasks, 
  FaUserTie,
  FaComments,
  FaArrowUp,
  FaArrowDown,
  FaRegSmile,
  FaRegFrown
} from 'react-icons/fa';
import { MdOutlineShowChart, MdGroupWork } from 'react-icons/md';

const Performance = () => {
  // Sample employee data
  const employee = {
    name: "Alex Johnson",
    position: "Senior Developer",
    department: "Engineering",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    joinDate: "2021-03-15"
  };

  // Performance metrics
  const metrics = [
    { 
      name: 'Productivity', 
      value: 85, 
      target: 80, 
      icon: <FaTasks className="text-blue-500 text-2xl" />,
      trend: 'up',
      description: 'Measures output per working hour compared to team average'
    },
    { 
      name: 'Quality', 
      value: 92, 
      target: 85, 
      icon: <FaStar className="text-yellow-500 text-2xl" />,
      trend: 'up',
      description: 'Error rate and client satisfaction scores'
    },
    { 
      name: 'Teamwork', 
      value: 78, 
      target: 75, 
      icon: <MdGroupWork className="text-green-500 text-2xl" />,
      trend: 'steady',
      description: 'Peer reviews and collaboration effectiveness'
    },
    { 
      name: 'Initiative', 
      value: 68, 
      target: 70, 
      icon: <FaUserTie className="text-purple-500 text-2xl" />,
      trend: 'down',
      description: 'Proactive contributions and leadership'
    }
  ];

  // Feedback data
  const feedback = [
    {
      id: 1,
      date: "2023-05-15",
      reviewer: "Sarah Miller (Team Lead)",
      content: "Alex has shown remarkable improvement in code quality this quarter. His pull request reviews are thorough and he's become a go-to resource for React optimizations.",
      rating: 4.8,
      tags: ["Technical Skills", "Code Quality"]
    },
    {
      id: 2,
      date: "2023-02-28",
      reviewer: "James Wilson (Product Manager)",
      content: "While technical skills are strong, there's room for improvement in cross-functional communication. Sometimes requirements need clarification multiple times.",
      rating: 3.5,
      tags: ["Communication", "Collaboration"]
    }
  ];

  // Calculate overall performance
  const overallScore = Math.round(metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Performance Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Comprehensive overview of {employee.name}'s performance metrics and growth
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="mr-4 w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
              <img 
                src={employee.avatar} 
                alt={employee.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{employee.name}</h3>
              <p className="text-sm text-gray-600">{employee.position}, {employee.department}</p>
            </div>
          </div>
        </div>

        {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Overall Score */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Overall Score</p>
                <h3 className="text-2xl font-bold mt-1">{overallScore}%</h3>
              </div>
              <div className={`p-2 rounded-full ${
                overallScore >= 80 ? 'bg-green-100 text-green-600' : 
                overallScore >= 70 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
              }`}>
                {overallScore >= 80 ? <FaRegSmile className="text-xl" /> : <FaRegFrown className="text-xl" />}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Performance</span>
                <span>{overallScore >= 80 ? 'Excellent' : overallScore >= 70 ? 'Good' : 'Needs Improvement'}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    overallScore >= 80 ? 'bg-green-500' : 
                    overallScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${overallScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Trend Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Quarterly Trend</p>
                <h3 className="text-2xl font-bold mt-1">+12%</h3>
              </div>
              <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                <MdOutlineShowChart className="text-xl" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Improved from last quarter</p>
          </div>

          {/* Rank Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Department Rank</p>
                <h3 className="text-2xl font-bold mt-1">8/42</h3>
              </div>
              <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                <FaMedal className="text-xl" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Top 20% of department</p>
          </div>

          {/* Feedback Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Recent Feedback</p>
                <h3 className="text-2xl font-bold mt-1">4.2/5</h3>
              </div>
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <FaComments className="text-xl" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">From peers and managers</p>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Performance Metrics</h2>
            <p className="text-gray-600">Detailed breakdown by evaluation category</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {metrics.map((metric, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 flex items-center">
                      {metric.icon}
                      <span className="ml-2">{metric.name}</span>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{metric.description}</p>
                  </div>
                  <div className={`flex items-center ${
                    metric.value >= metric.target ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {metric.trend === 'up' ? (
                      <FaArrowUp className="mr-1" />
                    ) : metric.trend === 'down' ? (
                      <FaArrowDown className="mr-1" />
                    ) : null}
                    <span className="font-medium">{metric.value}%</span>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Target: {metric.target}%</span>
                    <span>{metric.value >= metric.target ? 'Achieved' : 'Pending'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        metric.value >= metric.target ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${metric.value}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className={`font-medium ${
                    metric.value >= metric.target ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {metric.value >= metric.target ? 'Above target' : 'Below target'}
                  </span>
                  <span className="text-gray-500">
                    {Math.abs(metric.value - metric.target)}% {metric.value >= metric.target ? 'above' : 'below'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Performance Trend</h2>
            <p className="text-gray-600">Quarterly progression over the last 2 years</p>
          </div>
          <div className="p-6">
            <div className="h-80 bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg flex flex-col items-center justify-center">
              <FaChartLine className="text-gray-300 text-5xl mb-4" />
              <p className="text-gray-400">Performance chart visualization</p>
              <p className="text-xs text-gray-400 mt-2">(Would display actual chart data in production)</p>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Recent Feedback</h2>
            <p className="text-gray-600">Qualitative assessments from peers and managers</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {feedback.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-800">{item.reviewer}</h3>
                      <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.rating >= 4.5 ? 'bg-green-100 text-green-800' :
                        item.rating >= 3.5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.rating}/5
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{item.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;