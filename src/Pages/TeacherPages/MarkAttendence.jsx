import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Table, Select, Button, DatePicker, message, Tag } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

const mockStudents = [
  { studentId: '681c8fdc6329587244535349', name: 'Haseeb' },
  { studentId: '681c8fec632958724453534e', name: 'Haseeb2' },
];

export default function AttendancePage() {
  const { classId } = useParams();
  const [attendanceData, setAttendanceData] = useState([]);
  const [date, setDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addAttendanceDate, setAddAttendanceDate] = useState(dayjs());
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedUpdateRecord, setSelectedUpdateRecord] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, [date]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/getAllAttendance/${classId}/${date.format('YYYY-MM-DD')}`
      );

      const transformedData = res.data?.map((item, index) => ({
        key: index + 1,
        studentId: item.records[0]?.studentId?._id || '',
        name: item.records[0]?.studentId?.firstName || 'Unknown',
        email: item.records[0]?.studentId?.email || '',
        gender: item.records[0]?.studentId?.gender || '',
        status: item.records[0]?.status || 'Unknown',
        recordId: item.records[0]?._id || '',
        attendenceDate: item.date?.substring(0, 10),
        createdAt: item.createdAt?.substring(0, 10),
      }));

      setAttendanceData(transformedData || []);
    } catch (err) {
      message.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttendance = async () => {
    if (!selectedStudent || !selectedStatus || !addAttendanceDate) return;

    try {
      const res = await axios.post(`http://localhost:5000/api/markAttendance`, {
        classId,
        date: addAttendanceDate.format('YYYY-MM-DD'),
        records: [{ studentId: selectedStudent, status: selectedStatus }],
      });

      message.success(res.data.message);
      fetchAttendance();
      setAddModalVisible(false);
      setSelectedStudent(null);
      setSelectedStatus('');
      setAddAttendanceDate(dayjs());
    } catch (err) {
      message.error(err.response?.data?.message || 'Error marking attendance');
    }
  };

  const handleUpdateClick = (record) => {
    setSelectedUpdateRecord(record);
    setUpdatedStatus(record.status);
    setUpdateModalVisible(true);
  };

  const handleUpdateSave = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/updateAttendance`, {
        classId,
        date: date.format('YYYY-MM-DD'),
        studentId: selectedUpdateRecord.studentId,
        newStatus: updatedStatus,
      });

      message.success(res.data.message);
      fetchAttendance();
      setUpdateModalVisible(false);
    } catch (err) {
      message.error(err.response?.data?.message || 'Update failed');
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'Present':
        return <Tag color="green">Present</Tag>;
      case 'Absent':
        return <Tag color="red">Absent</Tag>;
      case 'Late':
        return <Tag color="orange">Late</Tag>;
      default:
        return <Tag color="gray">Unknown</Tag>;
    }
  };

  const columns = [
    { title: 'Student ID', dataIndex: 'studentId', render: (id) => id || 'N/A' },
    { title: 'Name', dataIndex: 'name', render: (name) => name || 'Unknown' },
    { title: 'Email', dataIndex: 'email', render: (email) => email || 'N/A' },
    { title: 'Status', dataIndex: 'status', render: (status) => getStatusTag(status) },
    { title: 'Mark Date', dataIndex: 'attendenceDate' },
    { title: 'Created Date', dataIndex: 'createdAt' },
    {
      title: 'Action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleUpdateClick(record)}>
          Update
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Student Attendance</h1>

      <div className="flex items-center gap-4 mb-4">
        <DatePicker
          value={date}
          onChange={(d) => setDate(d)}
          disabledDate={(current) => current && current > dayjs().endOf('day')}
        />
        <Button type="primary" onClick={() => setAddModalVisible(true)}>
          Add Attendance
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={attendanceData}
        pagination={false}
        rowKey="key"
        scroll={{ x: '100%' }}
        loading={loading}
        locale={{
          emptyText: 'No attendance records found for this date',
        }}
      />

      {/* Add Attendance Modal */}
      <Modal
        title="Add Attendance"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onOk={handleAddAttendance}
        okText="Add"
      >
        <div className="flex flex-col gap-4">
          <Select
            placeholder="Select Student"
            value={selectedStudent}
            onChange={(val) => setSelectedStudent(val)}
          >
            {mockStudents.map((student) => (
              <Option key={student.studentId} value={student.studentId}>
                {student.name}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Select Status"
            value={selectedStatus}
            onChange={(val) => setSelectedStatus(val)}
          >
            <Option value="Present">Present</Option>
            <Option value="Absent">Absent</Option>
            <Option value="Late">Late</Option>
          </Select>

          <DatePicker
            value={addAttendanceDate}
            onChange={(d) => setAddAttendanceDate(d)}
            disabledDate={(current) => current && current > dayjs().endOf('day')}
          />
        </div>
      </Modal>

      {/* Update Attendance Modal */}
      <Modal
        title="Update Attendance"
        open={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        onOk={handleUpdateSave}
        okText="Update"
      >
        <div className="flex flex-col gap-4">
          <p><strong>Name:</strong> {selectedUpdateRecord?.name || 'Unknown'}</p>
          <Select
            value={updatedStatus}
            onChange={(val) => setUpdatedStatus(val)}
            className="w-full"
          >
            <Option value="Present">Present</Option>
            <Option value="Absent">Absent</Option>
            <Option value="Late">Late</Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
}
