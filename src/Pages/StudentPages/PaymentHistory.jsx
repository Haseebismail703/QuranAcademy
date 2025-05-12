import React, { useEffect, useState } from 'react';
import axiosInstance from '../../Axios/axiosInstance';

const PaymentHistoryPage = ({ studentId }) => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format date to display in a more readable way
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fetch payment history data on component mount
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await axiosInstance.get(`paymentHistory/681c8fdc6329587244535349`);
        setPaymentHistory(response.data.paymentHistory); // Set payment history to state
      } catch (error) {
        setError("Error fetching payment history");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [studentId]); // Dependency array to refetch if studentId changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Payment History
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            View all your past payments and subscriptions
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {paymentHistory.map((payment) => (
            <div key={payment._id} className="border-b border-gray-200 last:border-b-0">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {payment.courseId.courseName} Course
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {payment.classType} · {payment.sessionDuration} mins per session
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    payment.paymentStatus === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.paymentStatus.charAt(0).toUpperCase() + payment.paymentStatus.slice(1)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Price</h4>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      ${payment.coursePrice}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Classes per week</h4>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {payment.classPerWeek}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Billing Period</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(payment.monthStart)} - {formatDate(payment.monthEnd)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                  <p>Payment ID: {payment._id}</p>
                  <p>Last updated: {formatDate(payment.updated_at)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {paymentHistory.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No payment history</h3>
            <p className="mt-1 text-gray-500">You haven't made any payments yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
