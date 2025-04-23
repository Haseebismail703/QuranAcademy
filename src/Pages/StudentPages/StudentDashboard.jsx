import React from 'react';
import { Card, Progress, Row, Col, Statistic, Divider } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StudentDashboard = () => {
  const monthlyAttendance = [
    { name: 'Jan', present: 20, absent: 2 },
    { name: 'Feb', present: 18, absent: 4 },
    { name: 'Mar', present: 22, absent: 1 },
    { name: 'Apr', present: 15, absent: 5 },
  ];

  const courseInfo = {
    name: 'Computer Science',
    fee: 2500,
    paid: 2000,
    endDate: '2023-12-15'
  };

  const sharedCardStyle = "shadow-md hover:shadow-lg transition-shadow h-full";

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Student Dashboard</h1>
      
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card className={sharedCardStyle}>
            <Statistic
              title="Attendance"
              value={75}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
              prefix={<CheckCircleOutlined />}
            />
            <Progress percent={75} strokeColor="#00C49F" />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className={sharedCardStyle}>
            <Statistic
              title="Present"
              value={75}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: 'green' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className={sharedCardStyle}>
            <Statistic
              title="Absent"
              value={25}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: 'red' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className={sharedCardStyle}>
            <Statistic
              title="Course Ends"
              value={courseInfo.endDate}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Monthly Attendance" className={sharedCardStyle}>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyAttendance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" stackId="a" fill="#00C49F" name="Present" />
                  <Bar dataKey="absent" stackId="a" fill="#FF8042" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Course Fee Status" className={sharedCardStyle}>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500">Course</p>
                <p className="text-lg font-semibold">{courseInfo.name}</p>
              </div>

              <Divider className="my-2" />

              <div>
                <p className="text-gray-500 mb-1">Total Fee</p>
                <div className="flex items-center">
                  <DollarOutlined className="text-2xl text-green-500 mr-2" />
                  <span className="text-xl font-bold">${courseInfo.fee}</span>
                </div>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Paid</p>
                <Progress
                  percent={(courseInfo.paid / courseInfo.fee) * 100}
                  strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                  format={() => `$${courseInfo.paid} / $${courseInfo.fee}`}
                />
              </div>

              <div>
                <p className="text-gray-500 mb-1">Remaining</p>
                <p className="text-xl font-bold text-red-500">
                  ${courseInfo.fee - courseInfo.paid}
                </p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentDashboard;
