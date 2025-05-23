import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../Axios/axiosInstance.js';
import { BookOpen, Link as LinkIcon, Clock, User, Loader2 } from "lucide-react";
import { Tag, message } from "antd";
import { UserContext } from "../../Context/UserContext.jsx";
export default function StudentClass() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [error, setError] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const {userData} = useContext(UserContext)
  const studentId = userData.id

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        const res = await axiosInstance.get(`/api/getAllClassesByStudentId/${studentId}`);
        setClasses(res.data || []);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Failed to load your classes. Please try again later.");
        showError("Failed to load classes");
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const res = await axiosInstance.get(`/api/getClassNotification`);
        setNotifications(res.data || []);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications. Please try again later.");
        showError("Failed to load notifications");
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);

  const showSuccess = (msg) => messageApi.success(msg);
  const showError = (msg) => messageApi.error(msg);

  const handleSeeResources = (classId) => navigate(`/api/student/class/resources/${classId}`);

  const handleCopyLink = (classId) => {
    const classData = classes.find(c => c._id === classId);
    const studentData = classData?.students?.find(s => s.studentId === studentId);

    if (studentData?.classLink) {
      navigator.clipboard.writeText(studentData.classLink);
      showSuccess("Class link copied to clipboard!");
    } else {
      showError("No class link available");
    }
  };

  const renderTimingTag = (timing) => {
    if (!timing) return <Tag color="gray">Not specified</Tag>;
    const time = timing.split(' ')[0];
    const hour = parseInt(time.split(':')[0]);
    let color = 'blue';

    if (timing.includes('AM') || (hour >= 5 && hour < 12)) color = 'gold';
    else if (timing.includes('PM') && hour < 5) color = 'orange';
    else color = 'volcano';

    return <Tag color={color}>{timing}</Tag>;
  };

  const isLoading = loadingClasses || loadingNotifications;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {contextHolder}

      <div className="flex items-center mb-8">
        <BookOpen className="h-8 w-8 mr-3 text-blue-600" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">My Classes</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
          <span className="ml-3 text-gray-600">Loading your classes...</span>
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
      ) : classes.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-lg text-center">
          <p className="mb-4">You are not enrolled in any classes yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((cls) => {
            const studentData = cls.students?.find(s => s.studentId === studentId) || {};
            const timing = studentData.studentTiming || cls.classTiming;
            const noti = notifications.find(n => n.classId === cls._id);

            return (
              <div
                key={cls._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 w-full"
              >
                {noti && noti.message && (
                  <div className="bg-yellow-100 py-2 px-4 text-yellow-800 text-sm font-medium">
                    <marquee scrollamount="4">{noti.title} - {noti.message}</marquee>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {cls.courseId?.courseName || 'Unnamed Course'}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <User className="mr-2 h-4 w-4" />
                        <span>Teacher: {cls.teacherId?.firstName || 'Not assigned'}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <Clock className="mr-2 h-4 w-4" />
                        <span className="mr-2">Timing:</span>
                        {renderTimingTag(timing)}
                      </div>
                    </div>
                    {studentData.classLink && <Tag color="green">Link Available</Tag>}
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleSeeResources(cls._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
                    >
                      <BookOpen size={16} />
                      View Resources
                    </button>

                    <button
                      onClick={() => handleCopyLink(cls._id)}
                      disabled={!studentData.classLink}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium  ${
                        studentData.classLink
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <LinkIcon size={16} />
                      {studentData.classLink ? 'Copy Link' : 'No Link'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
