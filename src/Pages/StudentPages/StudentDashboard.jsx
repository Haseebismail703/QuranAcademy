import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../../Axios/axiosInstance';
import AttendanceChart from '../../Components/StudentComponent/AttendenceChart';
import { UserContext } from '../../Context/UserContext';
const FeeDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userData} = useContext(UserContext)
  // console.log(userData)
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/getStudentDashboardData/${userData.id}`);
      console.log(response.data)
      setData(response.data);
    } catch (error) {
      console.error('Error fetching fee data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const CardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md p-4 h-full">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );

  const ProgressBar = ({ percentage }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
      <div
        className="bg-cyan-500 h-2.5 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );

  return (
    <>
      <div className="p-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {/* Total Paid Fee */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Total Paid Fee</p>
                  <p className="text-2xl font-bold text-gray-800">Rs {data?.totalPaidFee || 0}</p>
                  <p className="text-xs text-gray-400 mt-1">All time Fee</p>
                </div>
                <div className="text-blue-500 text-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Last Paid Fee */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-green-500 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Last Fee</p>
                  <p className="text-2xl font-bold text-gray-800">Rs {data?.lastPaidFee || 0}</p>
                  <p className="text-xs text-gray-400 mt-1">Most recent transaction</p>
                </div>
                <div className="text-green-500 text-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Pending Fee */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-orange-500 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Pending Fee</p>
                  <p className="text-2xl font-bold text-gray-800">Rs {data?.pendingFee || 0}</p>
                  <p className="text-xs text-gray-400 mt-1">Awaiting approval</p>
                </div>
                <div className="text-orange-500 text-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Rejected Fee */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-red-500 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Rejected Fee</p>
                  <p className="text-2xl font-bold text-gray-800">Rs {data?.rejectedFee || 0}</p>
                  <p className="text-xs text-gray-400 mt-1">Not approved</p>
                </div>
                <div className="text-red-500 text-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Classes */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-purple-500 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Total Classes</p>
                  <p className="text-2xl font-bold text-gray-800">{data?.totalClasses || 0}</p>
                  <p className="text-xs text-gray-400 mt-1">Active classes</p>
                </div>
                <div className="text-purple-500 text-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Progress Percentage */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-cyan-500 p-4">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-gray-500 text-sm">Total Attendence Progress</p>
                    <p className="text-2xl font-bold text-gray-800">{data?.attendance?.progressPercentage || 0}%</p>
                  </div>
                  <div className="text-cyan-500 text-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-auto">
                  <ProgressBar percentage={data?.attendance?.progressPercentage || 0} />
                  <p className="text-xs text-gray-400 mt-1">Total class: {data?.attendance?.total || 0} ,Present: {data?.attendance?.present || 0}, Absent: {data?.attendance?.absent || 0} </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      <AttendanceChart chartData={data} />
    </>


  );
};

export default FeeDashboard;