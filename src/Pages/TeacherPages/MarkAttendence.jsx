import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Table,
  Avatar,
  Button,
  Tag,
  DatePicker,
  Modal,
  Radio,
  Space,
  message,
  Spin,
  Badge,
  Empty
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import axiosInstance from '../../Axios/axiosInstance';
import dayjs from 'dayjs';

const AttendancePage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  let location = useLocation();
  let classDetail = location.state?.classDetail
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [status, setStatus] = useState('present');

  const fetchAttendance = async (date) => {
    try {
      setLoading(true);
      const formattedDate = date.format('YYYY-MM-DD');
      const response = await axiosInstance.get(
        `/getAllAttendance/${classId}/${formattedDate}`
      );

      // Find attendance record for the selected date
      const recordForDate = response.data.find(item =>
        dayjs(item.date).format('YYYY-MM-DD') === formattedDate
      );

      if (recordForDate) {
        setAttendanceData(recordForDate);
      } else {
        // No attendance record exists for this date
        setAttendanceData({
          date: formattedDate,
          records: []
        });
      }
    } catch (error) {
      message.error(error.response.data?.message || 'Failed to fetch attendance data');
      // console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId && selectedDate) {
      fetchAttendance(selectedDate);
    }
  }, [classId, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleStatusChange = (record) => {
    setCurrentStudent(record);
    setStatus(record.status || 'present');
    setIsModalVisible(true);
  };

  const updateAttendance = async () => {
    try {
      setUpdating(true);
      const formattedDate = selectedDate.format('YYYY-MM-DD');
      await axiosInstance.put('/updateAttendance', {
        classId,
        date: formattedDate,
        studentId: currentStudent.studentId._id,
        newStatus: status,
      });
      message.success('Attendance updated successfully');
      fetchAttendance(selectedDate);
      setIsModalVisible(false);
    } catch (error) {
      message.error('Refresh a page');
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const columns = [
    {
      title: 'Student',
      dataIndex: ['studentId', 'firstName'],
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Avatar
            src={record.studentId.profileUrl}
            icon={!record.studentId.profileUrl && (
              record.studentId.gender === 'female' ? '👩' : '👨'
            )}
            className="mr-3"
          />
          <div>
            <p className="font-medium">{text || 'Unknown Student'}</p>
            <p className="text-gray-500 text-xs">{record.studentId.email || ''}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color, icon, text;
        switch (status) {
          case 'present':
            color = 'green';
            icon = <CheckOutlined />;
            text = 'Present';
            break;
          case 'absent':
            color = 'red';
            icon = <CloseOutlined />;
            text = 'Absent';
            break;
          case 'late':
            color = 'orange';
            icon = <ClockCircleOutlined />;
            text = 'Late';
            break;
          default:
            color = 'gray';
            text = 'Not marked';
        }
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleStatusChange(record)}
          className="text-blue-600 p-0"
        >
          Update
        </Button>
      ),
    },
  ];

  const getStatusCount = (status) => {
    if (!attendanceData?.records) return 0;
    return attendanceData.records.filter(r => r.status === status).length;
  };

  // Safely calculate not marked count
  const getNotMarkedCount = () => {
    if (!attendanceData?.records) return 0;
    const total = attendanceData.records.length;
    const present = getStatusCount('present');
    const absent = getStatusCount('absent');
    const late = getStatusCount('late');
    return Math.max(0, total - present - absent - late);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          Back
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {classDetail?.courseId?.courseName || 'Course Name'}
          </h1>
          <p className="text-gray-500 text-lg">
            <ClockCircleOutlined className="mr-2" />
            {classDetail?.classTiming || 'Timing not specified'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Class Attendance
            </h1>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full md:w-64"
              format="DD MMM, YYYY"
              allowClear={false}
            />
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <Badge
              count={getStatusCount('present') || 0}
              showZero
              color="green"
              className="bg-green-50 px-4 py-2 rounded-lg"
            >
              <span className="text-green-700">Present</span>
            </Badge>
            <Badge
              count={getStatusCount('absent') || 0}
              showZero
              color="red"
              className="bg-red-50 px-4 py-2 rounded-lg"
            >
              <span className="text-red-700">Absent</span>
            </Badge>
            <Badge
              count={getStatusCount('late') || 0}
              showZero
              color="orange"
              className="bg-orange-50 px-4 py-2 rounded-lg"
            >
              <span className="text-orange-700">Late</span>
            </Badge>
            <Badge
              count={getNotMarkedCount() || 0}
              showZero
              color="gray"
              className="bg-gray-50 px-4 py-2 rounded-lg"
            >
              <span className="text-gray-700">Not Marked</span>
            </Badge>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={attendanceData?.records || []}
              rowKey={record => record.studentId?._id || Math.random().toString(36).substring(7)}
              pagination={false}
              locale={{
                emptyText: (
                  <div className="py-12 text-center">
                    <Empty
                      image={<ExclamationCircleOutlined className="text-4xl text-gray-400" />}
                      description={
                        <span className="text-gray-500">
                          No attendance records found for {selectedDate.format('DD MMM, YYYY')}
                        </span>
                      }
                    />
                    <Button
                      type="primary"
                      className="mt-4"
                      onClick={() => fetchAttendance(selectedDate)}
                    >
                      Refresh
                    </Button>
                  </div>
                )
              }}
            />
          )}
        </div>
      </div>

      <Modal
        title={`Update Attendance - ${currentStudent?.studentId?.firstName || 'Student'}`}
        open={isModalVisible}
        onOk={updateAttendance}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={updating}
        okText="Update"
        cancelText="Cancel"
        centered
      >
        <div className="py-4">
          <Radio.Group
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full"
          >
            <Space direction="vertical" className="w-full">
              <Radio value="present" className="block py-2">
                <Tag color="green" icon={<CheckOutlined />}>
                  Present
                </Tag>
              </Radio>
              <Radio value="absent" className="block py-2">
                <Tag color="red" icon={<CloseOutlined />}>
                  Absent
                </Tag>
              </Radio>
              <Radio value="late" className="block py-2">
                <Tag color="orange" icon={<ClockCircleOutlined />}>
                  Late
                </Tag>
              </Radio>
            </Space>
          </Radio.Group>
        </div>
      </Modal>
    </div>
  );
};

export default AttendancePage;