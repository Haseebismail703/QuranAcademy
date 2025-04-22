import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Avatar, Card, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, BookOutlined, DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const PackageManagement = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packages, setPackages] = useState([
    {
      id: '1',
      packageName: 'Quran Hifz Complete',
      course: 'Hifz Program',
      student: 'Ahmed Khan',
      price: '$499',
      duration: '12 Months',
      status: 'Complete'
    },
    {
      id: '2',
      packageName: 'Tajweed Essentials',
      course: 'Tajweed Course',
      student: 'Fatima Ali',
      price: '$299',
      duration: '6 Months',
      status: 'Complete'
    },
    {
      id: '3',
      packageName: 'Arabic Beginner',
      course: 'Arabic Language',
      student: 'Mohammed Hassan',
      price: '$199',
      duration: '3 Months',
      status: 'inComplete'
    }
  ]);

  // Dummy data for dropdowns
  const courses = [
    { id: '1', name: 'Hifz Program' },
    { id: '2', name: 'Tajweed Course' },
    { id: '3', name: 'Arabic Language' },
    { id: '4', name: 'Islamic Studies' },
    { id: '5', name: 'Fiqh Essentials' }
  ];

  const students = [
    { id: '1', name: 'Ahmed Khan', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: '2', name: 'Fatima Ali', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: '3', name: 'Mohammed Hassan', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: '4', name: 'Aisha Rahman', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' }
  ];

  const durations = [
    '1 Month', '3 Months', '6 Months', '12 Months', 'Custom'
  ];

  const showModal = (pkg = null) => {
    if (pkg) {
      form.setFieldsValue(pkg);
      setEditingPackage(pkg);
    } else {
      form.resetFields();
      setEditingPackage(null);
    }
    setIsModalVisible(true);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingPackage) {
        // Update existing package
        setPackages(packages.map(pkg => 
          pkg.id === editingPackage.id ? { ...pkg, ...values } : pkg
        ));
        message.success('Package updated successfully!');
      } else {
        // Add new package
        const newPackage = {
          id: (packages.length + 1).toString(),
          ...values,
          status: 'Complete'
        };
        setPackages([...packages, newPackage]);
        message.success('Package added successfully!');
      }
      setIsModalVisible(false);
    });
  };

  const handleDelete = (id) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
    message.success('Package deleted successfully!');
  };

  const columns = [
    {
      title: 'Package Name',
      dataIndex: 'packageName',
      key: 'packageName',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
      render: (course) => (
        <div className="flex items-center">
          <BookOutlined className="text-blue-500 mr-2" />
          {course}
        </div>
      ),
    },
    {
      title: 'Student',
      dataIndex: 'student',
      key: 'student',
      render: (student) => {
        const studentData = students.find(s => s.name === student);
        return (
          <div className="flex items-center">
            <Avatar 
              src={studentData?.avatar} 
              icon={<UserOutlined />} 
              size="small" 
              className="mr-2"
            />
            {student}
          </div>
        );
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <Tag color="green">{price}</Tag>,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => (
        <div className="flex items-center">
          <ClockCircleOutlined className="text-gray-500 mr-2" />
          {duration}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Complete' ? 'green' : 'red'} className="capitalize">
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined className="text-blue-500" />}
            onClick={() => showModal(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined className="text-red-500" />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="flex flex-col justify-between items-center mb-6 sm:flex-row sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Package Management</h1>
          <p className="text-gray-500">Manage all course packages for students</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          className="bg-blue-600 hover:bg-blue-700"
          size="large"
        >
          Add Package
        </Button>
      </div>

      <Card className="rounded-xl shadow-sm border-0 overflow-hidden">
        <Table
          columns={columns}
          dataSource={packages}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          className="custom-antd-table"
        />
      </Card>

      {/* Package Modal */}
      <Modal
        title={editingPackage ? 'Edit Package' : 'Add New Package'}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText={editingPackage ? 'Update' : 'Create'}
        cancelText="Cancel"
        width={700}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="packageName"
            label="Package Name"
            rules={[{ required: true, message: 'Please enter package name' }]}
          >
            <Input placeholder="Enter package name" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="course"
              label="Course"
              rules={[{ required: true, message: 'Please select course' }]}
            >
              <Select placeholder="Select course">
                {courses.map(course => (
                  <Option key={course.id} value={course.name}>{course.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="student"
              label="Student"
              rules={[{ required: true, message: 'Please select student' }]}
            >
              <Select
                placeholder="Select student"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {students.map(student => (
                  <Option key={student.id} value={student.name}>
                    <div className="flex items-center">
                      <Avatar src={student.avatar} size="small" className="mr-2" />
                      {student.name}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Please enter price' }]}
            >
              <Input
                prefix={<DollarOutlined className="text-gray-400" />}
                placeholder="Enter price"
              />
            </Form.Item>

            <Form.Item
              name="duration"
              label="Duration"
              rules={[{ required: true, message: 'Please select duration' }]}
            >
              <Select placeholder="Select duration">
                {durations.map(duration => (
                  <Option key={duration} value={duration}>{duration}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>

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

export default PackageManagement;