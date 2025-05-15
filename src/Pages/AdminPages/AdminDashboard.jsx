import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Skeleton, Row, Col, Avatar, Typography } from "antd";
import {
  UserAddOutlined,
  TeamOutlined,
  BookOutlined,
  SolutionOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import FeeChart from "../../Components/AdminComponent/FeeChart";

const { Title } = Typography;

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [waitingStudent, setWaitingStudent] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/getAdminDasData");
      setData(res.data);
      setWaitingStudent(
        res.data?.waitingStudent.map((item, key) => ({
          ...item,
          key,
        }))
      );
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const cards = data && [
    {
      title: "Students",
      newCount: `New student: ${data.newStudent}`,
      totalCount: data.allStudent,
      icon: <UserAddOutlined className="text-blue-500 text-2xl" />,
      color: "bg-blue-100",
    },
    {
      title: "Teachers",
      newCount: `New teacher: ${data.newTeacher}`,
      totalCount: data.allTeacher,
      icon: <TeamOutlined className="text-green-500 text-2xl" />,
      color: "bg-green-100",
    },
    {
      title: "Classes",
      newCount: `New class: ${data.newClass}`,
      totalCount: data.allClass,
      icon: <BookOutlined className="text-purple-500 text-2xl" />,
      color: "bg-purple-100",
    },
    {
      title: "Courses",
      newCount: `New course: ${data.newCourse}`,
      totalCount: data.allCourse,
      icon: <SolutionOutlined className="text-orange-500 text-2xl" />,
      color: "bg-orange-100",
    },
    {
      title: "Packages",
      newCount: `New package: ${data.newPackage}`,
      totalCount: data.allPackage,
      icon: <SolutionOutlined className="text-teal-500 text-2xl" />,
      color: "bg-teal-100",
    },
    {
      title: "This month paid fee",
      newCount: `All Time: ${data.allTimePaidFeeAmount} Rs`,
      totalCount: `${data.thisMonthPaidFeeAmount} Rs`,
      icon: <DollarOutlined className="text-red-500 text-2xl" />,
      color: "bg-red-100",
    },
  ];

  const columns = [
    {
      title: "No",
      dataIndex: "key",
      render: (key) => <p>{key + 1}</p>,
    },
    {
      title: "Profile",
      dataIndex: "profileUrl",
      render: (url) => <Avatar src={url} size={48} />,
    },
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span className="capitalize text-white bg-green-500 px-2 py-1 rounded-md text-xs">
          {status}
        </span>
      ),
    },
    {
      title: "Course Name",
      dataIndex: ["course", "courseName"],
    },
  ];

  return (
    <div className="p-4">
      <Title level={3} className="mb-6 text-center">
        Admin Dashboard
      </Title>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} className="mb-8">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <Col xs={24} sm={12} md={8} key={idx}>
                <Skeleton active paragraph={{ rows: 2 }} />
              </Col>
            ))
          : cards.map((card, idx) => (
              <Col xs={24} sm={12} md={8} key={idx}>
                <div className="relative rounded-2xl shadow-md bg-white hover:shadow-lg transition-all overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full w-2 ${card.color}`}
                  ></div>
                  <div className="p-4 pl-6">
                    <div className="flex items-start justify-between">
                      {card.icon}
                      <p className="text-xs text-gray-400 text-right">
                        {card.newCount}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p className="text-gray-600">{card.title}</p>
                      <p className="text-2xl font-bold text-black">
                        {card.totalCount}
                      </p>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
      </Row>

      {/* Fee Chart */}
      {loading ? <Skeleton active paragraph={{ rows: 6 }} /> : <FeeChart />}
<br />
      {/* Waiting Students Table */}
      <Card title="Waiting Students" className="rounded-2xl shadow-md mt-6">
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Table
            dataSource={waitingStudent}
            columns={columns}
            pagination={{ pageSize: 5 }}
            scroll={{ x: true }}
          />
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
