import React, { useState } from "react";
import { Table, DatePicker, Card, Space } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone, UserAddOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const initialStudents = [
  { id: 1, name: "Ali Raza", email: "ali@gmail.com", course: "React JS", present: false },
  { id: 2, name: "Sara Khan", email: "sara@gmail.com", course: "Node JS", present: false },
  { id: 3, name: "Ahmed Noor", email: "ahmed@gmail.com", course: "Python", present: false },
];

const Attendance = () => {
  const [students, setStudents] = useState(initialStudents);
  const [date, setDate] = useState(dayjs());

  const markAttendance = (id, status) => {
    const updated = students.map((student) =>
      student.id === id ? { ...student, present: status } : student
    );
    setStudents(updated);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-semibold">{text}</span>,
      filters: [
        ...new Set(initialStudents.map((student) => ({ text: student.name, value: student.name }))),
      ],
      onFilter: (value, record) => record.name.includes(value),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      filters: [
        ...new Set(initialStudents.map((student) => ({ text: student.email, value: student.email }))),
      ],
      onFilter: (value, record) => record.email.includes(value),
    },
    {
      title: "Course Name",
      dataIndex: "course",
      key: "course",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <button
            type="button"
            className="text-green-500"
            onClick={() => markAttendance(record.id, true)}
          >
            <CheckCircleTwoTone twoToneColor="#52c41a" /> Present
          </button>
          <button
            type="button"
            className="text-red-500"
            onClick={() => markAttendance(record.id, false)}
          >
            <CloseCircleTwoTone twoToneColor="#f5222d" /> Absent
          </button>
        </Space>
      ),
    },
  ];

  const totalPresent = students.filter((s) => s.present).length;
  const totalAbsent = students.length - totalPresent;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        <UserAddOutlined className="mr-2" />
        Mark Attendance
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <DatePicker
          className="w-full md:w-1/3"
          value={date}
          onChange={(value) => setDate(value)}
        />
      </div>

      <Card
        className="shadow-lg border border-gray-200"
        title="Student Attendance"
        extra={
          <span className="text-sm">
            ✅ Present: {totalPresent} / ❌ Absent: {totalAbsent}
          </span>
        }
      >
        <Table
          dataSource={students}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Attendance;
