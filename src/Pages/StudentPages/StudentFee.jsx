import { useState, useEffect } from "react";
import { Calendar, DollarSign, Package, Loader2, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Tag, message } from "antd";
import axiosInstance from '../../Axios/axiosInstance';

export default function FeePaymentPage() {
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
   const fetchPaymentData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/getPackageByStudentId/681c8fdc6329587244535349');
        setPaymentData(response.data || []);
      } catch (err) {
        console.error("Error fetching payment data:", err);
        setError("Failed to load payment information");
        showError("Failed to load payment data");
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    fetchPaymentData();
  }, []);

  const showError = (msg) => {
    messageApi.error(msg);
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'completed':
        return <Tag color="green" icon={<CheckCircle size={14} />}>Paid</Tag>;
      case 'inCompleted':
        return <Tag color="orange" icon={<AlertCircle size={14} />}>Pending</Tag>;
      default:
        return <Tag color="gray">Unknown</Tag>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {contextHolder}

      <div className="flex items-center mb-8">
        <DollarSign className="h-8 w-8 mr-3 text-blue-600" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Course Fee</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
          <span className="ml-3 text-gray-600">Loading fee information...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
          <AlertCircle className="mr-2" />
          {error}
          <button
            onClick={() => fetchPaymentData()}
            className="ml-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Try Again
          </button>
        </div>
      ) : paymentData.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-lg text-center flex flex-col items-center">
          <Package className="h-10 w-10 mb-3" />
          <p className="text-lg">No payment records found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentData.map((payment) => (
            <div
              key={payment._id}
              className={`bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition-all duration-300 ${payment.paymentStatus === 'completed' ? 'border-green-100' : 'border-orange-100'
                }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {payment.packageName || 'Course Package'}
                    </h3>
                    <p className="text-sm text-gray-500">Course : {payment.courseId?.courseName || 'Unnamed Course'}</p>
                  </div>
                  {/* {getStatusTag(payment.paymentStatus)} */}
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Monthly Fee:</span>
                    <span className="text-lg font-bold text-blue-600">${payment.coursePrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pending Fee:</span>
                    <span className="text-lg font-bold text-red-600">
                      ${payment.monthStart === "1970-01-01T00:00:00.000Z" ? payment.coursePrice : payment.totalPendingFee}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>
                      {payment.monthStart && payment.monthEnd ? (
                        <>
                          {formatDate(payment.monthStart)} - {formatDate(payment.monthEnd)}
                        </>
                      ) : 'No date range specified'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{payment.sessionDuration} min/session • {payment.classPerWeek} classes/week</span>
                  </div>
                  <div>
                    <span className="font-medium">Pending Months:</span> {payment.monthStart === "1970-01-01T00:00:00.000Z" ? 1 : payment.pendingMonths}
                  </div>
                  <div className={`text-sm font-medium ${payment.paymentStatus === 'inCompleted' ? 'text-red-500' : 'text-green-500'
                    }`}>
                    {payment.daysRemainingText}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}