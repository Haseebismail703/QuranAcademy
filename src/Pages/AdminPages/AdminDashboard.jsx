import React from 'react';
import { Card, Table, Avatar, Tag, Progress, Button, Space } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  ArrowUpOutlined
} from '@ant-design/icons';

const AdminDashboard = () => {
  // Dummy data for cards
  const stats = [
    {
      title: 'Total Students',
      value: '1,248',
      icon: <UserOutlined className="text-blue-500" />,
      progress: 75,
      trend: '12% increase',
      color: 'bg-blue-100'
    },
    {
      title: 'Active Courses',
      value: '24',
      icon: <BookOutlined className="text-green-500" />,
      progress: 60,
      trend: '8 new courses',
      color: 'bg-green-100'
    },
    {
      title: 'Teachers',
      value: '36',
      icon: <TeamOutlined className="text-purple-500" />,
      progress: 45,
      trend: '5 new teachers',
      color: 'bg-purple-100'
    },
    {
      title: 'Completion Rate',
      value: '82%',
      icon: <CheckCircleOutlined className="text-orange-500" />,
      progress: 82,
      trend: '3% improvement',
      color: 'bg-orange-100'
    }
  ];

  // Dummy data for table
  const students = [
    {
      key: '1',
      name: 'Ahmed Khan',
      email: 'ahmed.khan@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      status: 'active',
      assignedTeacher: 'Mr. John Smith',
      course: 'Hifz Program',
      progress: 75
    },
    {
      key: '2',
      name: 'Fatima Ali',
      email: 'fatima.ali@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      status: 'active',
      assignedTeacher: 'Ms. Emily Davis',
      course: 'Nazra Course',
      progress: 92
    },
    {
      key: '3',
      name: 'Mohammed Hassan',
      email: 'mohammed.h@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      status: 'inactive',
      assignedTeacher: 'Dr. Robert Johnson',
      course: 'Tajweed Advanced',
      progress: 45
    },
    {
      key: '4',
      name: 'Aisha Rahman',
      email: 'aisha.r@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      status: 'active',
      assignedTeacher: 'Mr. John Smith',
      course: 'Hifz Program',
      progress: 68
    },
    {
      key: '5',
      name: 'Ibrahim Malik',
      email: 'ibrahim.m@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      status: 'active',
      assignedTeacher: 'Ms. Sarah Wilson',
      course: 'Islamic Studies',
      progress: 81
    }
  ];

  const columns = [
    {
      title: 'Student',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar src={record.avatar} icon={<UserOutlined />} className="mr-3" />
          <div>
            <p className="font-medium text-gray-800 m-0">{text}</p>
            <p className="text-gray-500 text-sm m-0">{record.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'} className="capitalize">
          {status}
        </Tag>
      ),
    },
    {
      title: 'Assigned Teacher',
      dataIndex: 'assignedTeacher',
      key: 'assignedTeacher',
      render: (teacher) => <span className="text-gray-700">{teacher}</span>,
    },
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
      render: (course) => <span className="text-gray-700 font-medium">{course}</span>,
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <div className="flex items-center">
          <Progress 
            percent={progress} 
            showInfo={false} 
            strokeColor={progress > 70 ? '#10B981' : progress > 40 ? '#3B82F6' : '#EF4444'}
            className="mr-2 w-24"
          />
          <span className="text-sm font-medium">{progress}%</span>
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button 
          type="text" 
          icon={<EyeOutlined />} 
          className="text-blue-500 hover:text-blue-700"
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-full ${stat.color}`}>
                {React.cloneElement(stat.icon, { className: 'text-xl' })}
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500">{stat.trend}</span>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-500 mt-4">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1 mb-3">{stat.value}</p>
            <Progress 
              percent={stat.progress} 
              showInfo={false} 
              strokeColor={stat.progress > 70 ? '#10B981' : stat.progress > 40 ? '#3B82F6' : '#EF4444'}
            />
          </Card>
        ))}
      </div>

      {/* Students Table */}
      <Card 
        title={<span className="text-lg font-semibold">Student Overview</span>}
        className="rounded-xl shadow-sm"
      >
        <Table
          columns={columns}
          dataSource={students}
          pagination={{ pageSize: 5 }}
          rowClassName="hover:bg-gray-50"
          className="custom-antd-table"
          scroll={{"x" : "100%"}}
        />
      </Card>

      {/* Custom Table Styles */}
      <style>{`
        .custom-antd-table .ant-table-thead > tr > th {
          background-color: #f8fafc !important;
          color: #64748b !important;
          font-weight: 600 !important;
          border-bottom: 1px solid #e2e8f0 !important;
        }
        .custom-antd-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f1f5f9 !important;
        }
        .custom-antd-table .ant-table-pagination.ant-pagination {
          margin: 16px 0 !important;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;