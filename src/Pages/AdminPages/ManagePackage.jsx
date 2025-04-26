import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Avatar, Card, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, BookOutlined, DollarOutlined } from '@ant-design/icons';
import axiosInstance from '../../Axios/axiosInstance.js';
const { Option } = Select;

const PackageManagement = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packages, setPackages] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  let getCourseAndWaitingStudent = async () => {
    try {
      const Response = await axiosInstance.get("/getCourseAndWaitingStudent");
      if (Response.status === 200) {
        setCourses(Response.data?.courses);
        setStudents(Response.data?.students);
        console.log(Response.data);
      }
    } catch (error) {
      console.error(error);
      message.error(error.message || 'Something went wrong!');
    }



  }
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


  let getPackageData = async () => {
    try {
      const response = await axiosInstance.get("/getAllPackages");
      console.log(response.data);
      if (response.status === 200) {
        const packageData = response.data?.packageData
          .map(pkg => ({
            ...pkg,

          }));
        setPackages(packageData);

      } else {
        message.error('Failed to fetch packages');
      }
    } catch (error) {
      console.error(error);
      message.error('Something went wrong!');
    }
  };


  useEffect(() => {
    getPackageData();
    getCourseAndWaitingStudent()
  }, []);

console.log(editingPackage?.courseId?.courseName);
  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingPackage) {
          const updatedPackage = {
            packageName: values.packageName,
            courseId: values.courseId,
            studentId: values.studentId,
            coursePrice: values.coursePrice,
            classPerWeek: values.classPerWeek,
            classType: values.classType,
            sessionDuration: values.sessionDuration,
            duration: values.duration,
          };
        
          const response = await axiosInstance.put(`/updatePackage/${editingPackage._id}`, updatedPackage);
        
          if (response.status === 200) {
            let updatedPackageFromServer = response.data?.data;
            const student = students.find(student => student._id === updatedPackageFromServer.studentId);
            const course = courses.find(course => course._id === updatedPackageFromServer.courseId);
            let updatedIndex = packages.findIndex(pkg => pkg._id === updatedPackageFromServer._id);
            if (updatedIndex !== -1) {
              let updatedPackages = [...packages];
              updatedPackages[updatedIndex] = {
                ...updatedPackageFromServer,
                key: updatedIndex + 1,
                studentId: student,
                courseId: course,
              };
        
              setPackages(updatedPackages);
              message.success(response.data?.message || 'Package updated successfully!');
            }
          } else {
            message.error('Failed to update package');
          }
        }
        else {
          // Add new package (POST)
          const newPackage = {
            packageName: values.packageName,
            courseId: values.courseId,
            studentId: values.studentId,
            coursePrice: values.coursePrice,
            classPerWeek: values.classPerWeek,
            classType: values.classType,
            sessionDuration: values.sessionDuration,
            duration: values.duration,
          };

          const response = await axiosInstance.post('/createPackage', newPackage);
        //  console.log(response.data);
          if (response.status === 200) {
            // filter the student and courseName
            const student = students.find(student => student._id === response.data?.data?.studentId);
            const course = courses.find(course => course._id === response.data?.data?.courseId);
            let newPackageWithKey = { ...packages, key: packages.length + 1, ...response.data?.data , studentId: student, courseId: course };
            setPackages([...packages, newPackageWithKey]);
            message.success('Package added successfully!');
          } else {
            message.error('Failed to add package');
          }
        }
        setIsModalVisible(false);
      } catch (error) {
        console.error(error);
        message.error(error.message || 'Something went wrong!');
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/deletePackage/${id}`);
      if (response.status === 200) {
        setPackages(prevpkg => prevpkg.filter(pkg => pkg._id !== id));
        message.success(response.data?.message  ||'Package deleted successfully!');
      } else {
        message.error('Failed to delete package');
      }
    } catch (error) {
      console.error(error);
      message.error( error.message ||'Something went wrong!');
    }
  };



  const columns = [
    {
      title: 'NO',
      dataIndex: 'index',
      key: 'index',
      render: (_, record, index) => <span className="font-medium">{index + 1}</span>,
    },
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
      render: (_, record) => (
        <div className="flex items-center">
          <BookOutlined className="text-blue-500 mr-2" />
          {record.courseId?.courseName}
        </div>
      ),
    },
    {
      title: 'Student',
      dataIndex: 'student',
      key: 'student',
      render: (_, record) => {
        return (
          <div className="flex items-center gap-1.5">
            <Avatar
              src={"https://randomuser.me/api/portraits"}
              icon={<UserOutlined />}
              size="small"
              className="mr-2"
            />
            {record.studentId?.firstName}
          </div>
        );
      },
    },
    {
      title: 'coursePrice',
      dataIndex: 'coursePrice',
      key: 'coursePrice',
      render: (price) => <Tag color="green">{price}$</Tag>,
    },
    {
      title: 'Class Type',
      dataIndex: 'classType',
      key: 'classType',
    },
    {
      title: 'Classes/Week',
      dataIndex: 'classPerWeek',
      key: 'classPerWeek',
    },
    {
      title: 'Session Duration',
      dataIndex: 'sessionDuration',
      key: 'sessionDuration',
    },
    {
      title: 'Payment status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'complete' ? 'green' : 'red'} className="capitalize">
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
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="flex flex-col justify-between items-center mb-6 sm:flex-row sm:items-center  gap-4">
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
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          className="custom-antd-table"
          scroll={{ x: "100%" }}
        />
      </Card>

      {/* Package Modal */}
      <Modal
        title={editingPackage ? 'Edit Package' : 'Add New Package'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText={editingPackage ? 'Update' : 'Create'}
        cancelText="Cancel"
        width={700}
      >

        <Form form={form} layout="vertical" className="mt-4" 
  >
          <Form.Item
            name="packageName"
            label="Package Name"
            rules={[{ required: true, message: 'Please enter package name' }]}
          >
            <Input placeholder="Enter package name" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="courseId"
              label="Course"
              rules={[{ required: true, message: 'Please select course' }]}
            >
              <Select placeholder="Select course"
               > 
                {courses.map(course => (
                  <Option key={course._id} value={course._id}>{course.courseName}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="studentId"
              label="Student"
              rules={[{ required: true, message: 'Please select student' }]}
            >


              <Select
                placeholder="Select student"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => {
                  const children = option?.children?.props?.children || [];
                  const nameNode = children[1];
                  const idNode = children[2];

                  const name = nameNode?.props?.children || '';
                  const idText = idNode?.props?.children || '';

                  const nameStr = Array.isArray(name) ? name.join(' ') : name;
                  const idStr = Array.isArray(idText) ? idText.join(' ') : idText;

                  const searchStr = `${nameStr} ${idStr}`.toLowerCase();

                  return searchStr.includes(input.toLowerCase());
                }}
              >
                {students.map(student => (
                  <Option key={student._id} value={student._id}>
                    <div className="flex items-center gap-2">
                      <Avatar src={student.avatar && student.avatar} icon={!student.avatar && <UserOutlined />} size="small" className="mr-2" />
                      <span>{`${student.firstName || ''} ${student.lastName || ''}`}</span>
                      <span className="text-gray-400">({student._id?.substring(0, 6)})</span>
                    </div>
                  </Option>
                ))}
              </Select>




            </Form.Item>

            <Form.Item
              name="coursePrice"
              label="Course Price"
              rules={[{ required: true, message: 'Please enter course price' }]}
            >
              <Input
                prefix={<DollarOutlined className="text-gray-400" />}
                placeholder="Enter course price"
              />
            </Form.Item>

            <Form.Item
              name="classPerWeek"
              label="Classes Per Week"
              rules={[{ required: true, message: 'Please enter classes per week' }]}
            >
              <Input placeholder="Enter number of classes per week" />
            </Form.Item>

            <Form.Item
              name="classType"
              label="Class Type"
              rules={[{ required: true, message: 'Please select class type' }]}
            >
              <Select placeholder="Select class type" value={editingPackage?.classType}>
                <Option value="One to One">One to One</Option>
                <Option value="Group">Group</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="sessionDuration"
              label="Session Duration"
              rules={[{ required: true, message: 'Please enter session duration' }]}
            >
              <Input placeholder="e.g., 30 minutes, 1 hour" />
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