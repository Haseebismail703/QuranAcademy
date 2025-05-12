import { useState, useEffect } from "react";
import { Calendar, DollarSign, Package, Loader2 } from "lucide-react";
import { Tag, message } from "antd";
import axiosInstance from '../../Axios/axiosInstance';

export default function FeePaymentPage() {
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/getPackageByStudentId/681c8fdc6329587244535349');
        setPaymentData(response.data || []);
        console.log("Payment Data:", response.data);
      } catch (err) {
        console.error("Error fetching payment data:", err);
        setError("Failed to load payment information");
        showError("Failed to load payment data");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, []);

  const showError = (msg) => {
    messageApi.error(msg);
  };

  const handlePayNow = (paymentId) => {
    messageApi.info("Redirecting to payment gateway...");
    console.log("Initiating payment for:", paymentId);
    // Add your payment gateway redirect logic here
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'completed':
        return <Tag color="green">Paid</Tag>;
      case 'inCompleted':
        return <Tag color="orange">Pending</Tag>;
      default:
        return <Tag color="gray">Unknown</Tag>;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {contextHolder}

      <div className="flex items-center mb-8">
        <DollarSign className="h-8 w-8 mr-3 text-blue-600" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Course Payments</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
          <span className="ml-3 text-gray-600">Loading payment information...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Try Again
          </button>
        </div>
      ) : paymentData.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-lg text-center">
          <p className="mb-4">No payment records found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentData.map((payment) => (
            <div
              key={payment._id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {payment.packageName || 'Course Package'}
                  </h3>
                  {getStatusTag(payment.paymentStatus)}
                </div>

                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-700">
                    {payment.courseId?.courseName || 'Unnamed Course'}
                  </h4>
                  <p className="text-sm text-gray-500">{payment.classType}</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-blue-600">
                    ${payment.coursePrice}
                  </div>
                  <div className="text-sm text-gray-500">
                    {payment.classPerWeek} classes/week
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Duration: {payment.sessionDuration} min/session</span>
                  </div>
                  <div>
                    <strong>Pending Months:</strong>  {payment.monthStart === "1970-01-01T00:00:00.000Z"
                      ? 1 : payment.pendingMonths}
                  </div>
                  <div>
                    <strong>Total Pending Fee:</strong> ${payment.monthStart === "1970-01-01T00:00:00.000Z" ? payment.coursePrice : payment.totalPendingFee}
                  </div>
                </div>

                {!(payment.paymentStatus === 'completed' || new Date(payment.monthStart).getTime() === 0) && (
                  <div className="font-medium text-sm mb-3 text-center text-red-600">
                    Please pay your fee to activate this package
                  </div>
                )}



                <button
                  onClick={() => handlePayNow(payment._id)}
                  className={`w-full text-white py-2 px-4 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 bg-blue-600 hover:bg-blue-700`}
                >
                  {payment.paymentStatus === 'completed' ? 'Payment Completed' : 'Pay Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
