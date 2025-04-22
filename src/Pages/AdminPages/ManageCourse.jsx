import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Avatar, Popconfirm, message, Space } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

const { Option } = Select;

const ManageCourses = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courses, setCourses] = useState([
    {
      id: '1',
      name: 'Quran Hifz Program',
      duration: '12 Months',
      status: 'active',
      theme: 'blue',
      students: 24,
      createdAt: '2023-01-15'
    },
    {
      id: '2',
      name: 'Tajweed Mastery',
      duration: '6 Months',
      status: 'active',
      theme: 'green',
      students: 18,
      createdAt: '2023-02-20'
    },
    {
      id: '3',
      name: 'Arabic Language',
      duration: '9 Months',
      status: 'inactive',
      theme: 'orange',
      students: 12,
      createdAt: '2023-03-10'
    },
    {
      id: '4',
      name: 'Islamic Studies',
      duration: '3 Months',
      status: 'active',
      theme: 'purple',
      students: 32,
      createdAt: '2023-04-05'
    },
    {
      id: '5',
      name: 'Fiqh Essentials',
      duration: '4 Months',
      status: 'active',
      theme: 'red',
      students: 15,
      createdAt: '2023-05-12'
    }
  ]);

  const themeOptions = [
    { value: 'blue', label: 'Blue Theme', color: '#3B82F6' },
    { value: 'green', label: 'Green Theme', color: '#10B981' },
    { value: 'orange', label: 'Orange Theme', color: '#F59E0B' },
    { value: 'purple', label: 'Purple Theme', color: '#8B5CF6' },
    { value: 'red', label: 'Red Theme', color: '#EF4444' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const durationOptions = [
    { value: '3 Months', label: '3 Months' },
    { value: '6 Months', label: '6 Months' },
    { value: '9 Months', label: '9 Months' },
    { value: '12 Months', label: '12 Months' },
    { value: 'Custom', label: 'Custom Duration' },
  ];

  const showModal = (course = null) => {
    if (course) {
      form.setFieldsValue(course);
      setEditingCourse(course);
    } else {
      form.resetFields();
      setEditingCourse(null);
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingCourse) {
        // Update existing course
        setCourses(courses.map(course => 
          course.id === editingCourse.id ? { ...course, ...values } : course
        ));
        message.success('Course updated successfully!');
      } else {
        // Add new course
        const newCourse = {
          id: (courses.length + 1).toString(),
          ...values,
          students: 0,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setCourses([...courses, newCourse]);
        message.success('Course added successfully!');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = (id) => {
    setCourses(courses.filter(course => course.id !== id));
    message.success('Course deleted successfully!');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircleOutlined className="text-green-500" />;
      case 'inactive':
        return <CloseCircleOutlined className="text-red-500" />;
      default:
        return null;
    }
  };

  const columns = [
    {
      title: 'Course Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar 
            style={{ 
              backgroundColor: themeOptions.find(t => t.value === record.theme)?.color || '#3B82F6',
              color: 'white'
            }}
            className="mr-3"
          >
            {text.charAt(0)}
          </Avatar>
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => (
        <div className="flex items-center text-gray-600">
          <ClockCircleOutlined className="mr-2" />
          {duration}
        </div>
      ),
    },
    {
      title: 'Students',
      dataIndex: 'students',
      key: 'students',
      render: (students) => (
        <Tag color="blue" className="font-medium">
          {students} Students
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={status === 'active' ? 'green' : 'red'} 
          className="flex items-center capitalize"
        >
          {getStatusIcon(status)}
          <span className="ml-1">{status}</span>
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <span className="text-gray-500">{date}</span>,
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
          <Popconfirm
            title="Are you sure to delete this course?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            <Button
              type="text"
              icon={<DeleteOutlined className="text-red-500" />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Courses</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Course
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          rowClassName="hover:bg-gray-50"
          className="custom-antd-table"
          scroll={{"x" : "100%"}}
        />
      </div>

      {/* Add/Edit Course Modal */}
      <Modal
        title={editingCourse ? 'Edit Course' : 'Add New Course'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingCourse ? 'Update' : 'Create'}
        cancelText="Cancel"
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-6">
          <Form.Item
            name="name"
            label="Course Name"
            rules={[{ required: true, message: 'Please enter course name' }]}
          >
            <Input placeholder="Enter course name" />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration"
            rules={[{ required: true, message: 'Please select duration' }]}
          >
            <Select placeholder="Select duration">
              {durationOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="theme"
            label="Theme Color"
            rules={[{ required: true, message: 'Please select theme' }]}
          >
            <Select placeholder="Select theme">
              {themeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: option.color }}
                    />
                    {option.label}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
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

export default ManageCourses;