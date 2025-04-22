import React, { useState } from "react";
import { Table, Switch, Card, DatePicker, Button, message } from "antd";
import dayjs from "dayjs";

const initialStudents = [
  { id: 1, name: "Ali Raza", email: "ali@gmail.com", present: false },
  { id: 2, name: "Sara Khan", email: "sara@gmail.com", present: false },
  { id: 3, name: "Ahmed Noor", email: "ahmed@gmail.com", present: false },
];

const Attendence = () => {
  const [students, setStudents] = useState(initialStudents);
  const [date, setDate] = useState(dayjs());

  const handleToggle = (id, checked) => {
    const updated = students.map((student) =>
      student.id === id ? { ...student, present: checked } : student
    );
    setStudents(updated);
  };

  const handleSubmit = () => {
    const presentList = students.filter((s) => s.present);
    message.success(`${presentList.length} students marked present`);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      key: "present",
      render: (_, record) => (
        <Switch
          checkedChildren="Present"
          unCheckedChildren="Absent"
          checked={record.present}
          onChange={(checked) => handleToggle(record.id, checked)}
        />
      ),
    },
  ];

  const totalPresent = students.filter((s) => s.present).length;
  const totalAbsent = students.length - totalPresent;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        📝 Attendance Management
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <DatePicker
          className="w-full md:w-1/3"
          value={date}
          onChange={(value) => setDate(value)}
        />
        <Button
          type="primary"
          className="bg-blue-600 px-6"
          onClick={handleSubmit}
        >
          Submit Attendance
        </Button>
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

export default Attendence;
