import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Space, message, Tag, Avatar, Card, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';
import axiosInstance from '../../Axios/axiosInstance.js';
const ManageTeachers = () => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [teachers, setTeachers] = useState([]);

    const columns = [
        {
            title: 'NO',
            dataIndex: 'index',
            key: 'index',
            render: (_, record, index) => <span className="font-medium">{index + 1}</span>,
        },
        {
            title: 'Teacher',
            dataIndex: 'firstName',
            key: 'firstName',
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        src={record.avatar && record.avatar}
                        icon={!record.avatar && <UserOutlined />}
                        className="mr-3"
                    />
                    <div>
                        <p className="font-medium text-gray-800 m-0">{record.firstName}</p>
                        <p className="text-gray-500 text-sm m-0">{record.email}</p>
                    </div>
                </div>
            ),
        },
        // {
        //     title: 'Class',
        //     dataIndex: 'class',
        //     key: 'class',
        //     render: (classList) => (
        //         <div className="flex flex-wrap gap-1">
        //             {classList.map((className, index) => (
        //                 <Tag key={index} color="blue">{className || "___"}</Tag>
        //             ))}
        //         </div>
        //     ),
        // },
        // {
        //     title: 'Students',
        //     dataIndex: 'students',
        //     key: 'students',
        //     render: (students) => (
        //         <div className="flex items-center text-gray-600">
        //             <TeamOutlined className="mr-2" />
        //             <span className="font-medium">{students}</span>
        //         </div>
        //     ),
        // },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'} className="capitalize">
                    {status === 'active' ? 'active' : 'Block'}
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
                        onClick={() => handleEdit(record)}
                        className="hover:bg-blue-50"
                    />
                </Space>
            ),
        },
    ];



    // Create New Teacher
    const createTeacher = async (teacherData) => {
        try {
            const response = await axiosInstance.post('/signupUser', teacherData);
            message.success('Teacher created successfully');
            getTeacher();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error creating teacher:', error);
            message.error(error.message || 'Failed to create teacher');
        }
    };

    // Update Existing Teacher
    const updateTeacher = async (id, updatedData) => {
        try {
            await axiosInstance.put(`/updateTeacher/${id}`, updatedData);
            message.success('Teacher updated successfully');
            getTeacher();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error updating teacher:', error);
            message.error(error.message || 'Failed to update teacher');
        }
    };





    const handleSubmit = () => {
        form.validateFields().then(values => {
            if (editingTeacher) {
                // Update Mode
                updateTeacher(editingTeacher._id, {
                    firstName: values.name, 
                    status: values.status
                });
            } else {
                // Create Mode
                createTeacher({
                    firstName: values.name,
                    email: values.email,
                    role: "teacher",
                });
            }
        });
    };


    const handleEdit = (record) => {
        form.setFieldsValue({
            name: record.firstName,
            status: record.status,
        });
        setEditingTeacher(record);
        setIsModalVisible(true);
    };


    const handleAdd = () => {
        form.resetFields();
        setEditingTeacher(null);
        setIsModalVisible(true);
    };



    const getTeacher = async () => {
        try {
            const response = await axiosInstance.get('/getAllTeacher');
            let data = response.data?.teachers?.map((teacher, index) => ({
                _id: teacher._id,
                firstName: teacher.firstName,
                lastName: teacher.lastName,
                email: teacher.email,
                class: teacher.classes?.length,
                students: teacher.students,
                status: teacher.status,
                avatar: teacher.profileUrl

            }));
            setTeachers(data || []);
            // message.success('Teachers fetched successfully!');
        } catch (error) {
            console.error('Error fetching teacher:', error);
            message.error(error.message || 'Failed to fetch teacher!');
        }
    };

    useEffect(() => {
        getTeacher()
    }, [])

    return (
        <div className="container mx-auto px-4 py-8">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Teacher Management</h1>
                    <p className="text-gray-500">Manage all teachers in your institution</p>
                </div>
                <Button
                    type="primary"
                    onClick={handleAdd}
                    icon={<PlusOutlined />}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center"
                    size="large"
                >
                    Add Teacher
                </Button>
            </div>

            <Card
                className="rounded-xl shadow-sm overflow-hidden border-0"
            >
                <Table
                    columns={columns}
                    dataSource={teachers}
                    pagination={{ pageSize: 5 }}
                    rowClassName="hover:bg-gray-50"
                    className="custom-antd-table"
                    scroll={{ "x": "100%" }}
                    rowKey="_id"
                />
            </Card>

            {/* Teacher Modal */}
            <Modal
                title={editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
                open={isModalVisible}
                onOk={handleSubmit}
                onCancel={() => setIsModalVisible(false)}
                okText={editingTeacher ? 'Update' : 'Create'}
                cancelText="Cancel"
                width={600}
            >
                <Form form={form} layout="vertical" className="mt-6">
                    {editingTeacher && (
                        <Form.Item name="key" hidden>
                            <Input />
                        </Form.Item>
                    )}
                    <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please enter teacher name' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="Enter teacher's full name"
                        />
                    </Form.Item>
                    {!editingTeacher &&
                        (<Form.Item
                            name="email"
                            label="Email Address"
                            rules={[
                                { required: true, message: 'Please enter email address' },
                                { type: 'email', message: 'Please enter valid email' },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined className="text-gray-400" />}
                                placeholder="Enter teacher's email"
                            />
                        </Form.Item>)
                    }

                    {editingTeacher && (
                        <Form.Item
                            name="status"
                            label="Status"
                            valuePropName="checked"
                        >
                            <Switch
                                checkedChildren="Active"
                                unCheckedChildren="Block"
                                defaultChecked={editingTeacher?.status === 'active'}
                            />
                        </Form.Item>
                    )}

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

export default ManageTeachers;