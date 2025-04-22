import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Space, message, Tag, Avatar, Card, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';

const ManageTeachers = () => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [teachers, setTeachers] = useState([
        {
            key: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            students: 25,
            status: true,
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            class: ["Hifz"]
        },
        {
            key: '2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            students: 18,
            status: false,
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
            class: ["Hifz"]
        },
        {
            key: '3',
            name: 'Robert Johnson',
            email: 'robert.j@example.com',
            students: 32,
            status: true,
            avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
            class: ["Hifz"]
        },
        {
            key: '4',
            name: 'Emily Davis',
            email: 'emily.d@example.com',
            students: 22,
            status: true,
            avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
            class: ["Hifz"]
        },
        {
            key: '5',
            name: 'Michael Wilson',
            email: 'michael.w@example.com',
            students: 15,
            status: false,
            avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
            class: ["Hifz"]
        },
    ]);

    const columns = [
        {
            title: 'Teacher',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div className="flex items-center">
                    <Avatar
                        src={record.avatar}
                        icon={<UserOutlined />}
                        className="mr-3"
                    />
                    <div>
                        <p className="font-medium text-gray-800 m-0">{text}</p>
                        <p className="text-gray-500 text-sm m-0">{record.email}</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Class',
            dataIndex: 'class',
            key: 'class',
            render: (classList) => (
                <div className="flex flex-wrap gap-1">
                    {classList.map((className, index) => (
                        <Tag key={index} color="blue">{className || "___"}</Tag>
                    ))}
                </div>
            ),
        },
        {
            title: 'Students',
            dataIndex: 'students',
            key: 'students',
            render: (students) => (
                <div className="flex items-center text-gray-600">
                    <TeamOutlined className="mr-2" />
                    <span className="font-medium">{students}</span>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status ? 'green' : 'red'} className="capitalize">
                    {status ? 'Active' : 'Inactive'}
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
                    <Popconfirm
                        title="Are you sure to delete this teacher?"
                        onConfirm={() => handleDelete(record.key)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            icon={<DeleteOutlined className="text-red-500" />}
                            className="hover:bg-red-50"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleStatusChange = (key, status) => {
        setTeachers(teachers.map(teacher =>
            teacher.key === key ? { ...teacher, status } : teacher
        ));
        message.success(`Teacher ${status ? 'activated' : 'deactivated'}`);
    };

    const handleDelete = (key) => {
        setTeachers(teachers.filter(teacher => teacher.key !== key));
        message.success('Teacher deleted successfully');
    };

    const handleEdit = (record) => {
        form.setFieldsValue(record);
        setEditingTeacher(record);
        setIsModalVisible(true);
    };

    const handleAdd = () => {
        form.resetFields();
        setEditingTeacher(null);
        setIsModalVisible(true);
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            if (editingTeacher) {
                setTeachers(teachers.map(teacher =>
                    teacher.key === editingTeacher.key ? { ...teacher, ...values } : teacher
                ));
                message.success('Teacher updated successfully');
            } else {
                const newTeacher = {
                    ...values,
                    key: (teachers.length + 1).toString(),
                    students: 0,
                    status: true,
                    avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`,
                    subjects: ['Math'] // Default subject
                };
                setTeachers([...teachers, newTeacher]);
                message.success('Teacher added successfully');
            }
            setIsModalVisible(false);
        });
    };

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
                    {!editingTeacher  &&
                       ( <Form.Item
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
                                unCheckedChildren="Inactive"
                                defaultChecked={editingTeacher?.status}
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