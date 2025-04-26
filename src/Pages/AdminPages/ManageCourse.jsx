import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Avatar, Popconfirm, message, Space } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import axiosInstance from '../../Axios/axiosInstance.js'
const { Option } = Select;

const ManageCourses = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courses, setCourses] = useState([]);

  const themeOptions = [
    { value: 'blue', label: 'Blue Theme', color: '#3B82F6' },
    { value: 'green', label: 'Green Theme', color: '#10B981' },
    { value: 'orange', label: 'Orange Theme', color: '#F59E0B' },
    { value: 'purple', label: 'Purple Theme', color: '#8B5CF6' },
    { value: 'red', label: 'Red Theme', color: '#EF4444' },
  ];


  const durationOptions = [
    { value: '3 Months', label: '3 Months' },
    { value: '6 Months', label: '6 Months' },
    { value: '9 Months', label: '9 Months' },
    { value: '12 Months', label: '12 Months' },
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


// create and update course 
  const handleOk = async () => {
    // console.log('Form values:', form.getFieldsValue());

    try {
      const values = await form.validateFields();

      if (editingCourse) {
        // ✅ Update course
        // console.log('Editing course:', editingCourse);
        const response = await axiosInstance.put(`/updateCourseDetails/${editingCourse._id}`, values);
        // console.log('Update response:', response.data);

        if (response.status === 200) {
          const updatedCourse = response.data.course

          // 🔁 Find index of course in current state
          const updatedIndex = courses.findIndex(course => course._id === updatedCourse._id);
          //  console.log('Updated index:', updatedIndex);
          if (updatedIndex !== -1) {
            // ✅ Create new array with updated course
            const updatedCourses = [...courses];
            updatedCourses[updatedIndex] = {
              ...updatedCourse,
              key: updatedIndex + 1, // add key for table or list
            };

            setCourses(updatedCourses);
            message.success(response.data.message || 'Course updated successfully!');
          } else {
            message.error('Course not found in state!');
          }
        }

      } else {
        //  Create new course
        const key = courses.length;
        const dataWithIndex = { ...values, key };

        const response = await axiosInstance.post('/createCourse', dataWithIndex);
        // console.log('Create response:', response.data);

        if (response.status === 200) {
          const newCourseWithKey = { ...response.data.courseData, key };
          setCourses([...courses, newCourseWithKey]);
          message.success(response.data.message || 'Course created successfully!');
        }
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error:', error);
      if (error?.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error instanceof Error) {
        message.error(error.message || 'Something went wrong!');
      } else {
        message.error('Failed to process the form!');
      }
    }
  };

// get the course data 
  const getCourses = async () => {
    try {
      const response = await axiosInstance.get('/getAllCourses');
      // console.log('Courses:', response.data?.Courses);
      let coursesData = response.data?.Courses.map((course, index) => ({
        ...course,
      }));
      // console.log('Courses Data:', coursesData);
      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      message.error(error.message || 'Failed to fetch courses!');
    }
  };
// delete course
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/deleteCourse/${id}`);
      setCourses(prevCourses => prevCourses.filter(course => course._id !== id));
      message.success('Course deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      message.error('Failed to delete course. Please try again.');
    }
  };

  useEffect(() => {
    getCourses();
  }, [])

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'NO',
      dataIndex: 'index',
      key: 'index',
      render: (_, record, index) => <span className="font-medium">{index + 1}</span>,
    },
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-1.5">
          <Avatar
            style={{
              backgroundColor: themeOptions.find(t => t.value === record.theme)?.color || '#3B82F6',
              color: 'white'
            }}
          >
            {text?.charAt(0)}
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
          {students || 0 } Students
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => <span className="text-gray-500">{date?.substring(0, 10)}</span>,
    },
    {
      title: 'updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date) => <span className="text-gray-500">{date?.substring(0, 10)}</span>,
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
            onConfirm={() => handleDelete(record._id)}
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
          pagination={{ pageSize: 5 }}
          rowClassName="hover:bg-gray-50"
          className="custom-antd-table"
          scroll={{ "x": "100%" }}
          rowKey={'_id'}
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
            name="courseName"
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