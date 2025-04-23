import React, { useState } from 'react';
import { Table, Avatar, Button, Modal, Space, Tag, Input, Tooltip, message } from 'antd';
import { SearchOutlined, UserOutlined, LinkOutlined } from '@ant-design/icons';

const EnrolledStudent = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [linkModalVisible, setLinkModalVisible] = useState(false);
    const [classLink, setClassLink] = useState('');

    const [students, setStudents] = useState([
        {
            key: '1',
            name: 'Ahmed Khan',
            email: 'ahmed.khan@example.com',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            attendance: 12,
            enrollmentDate: '2023-01-15',
        },
        {
            key: '2',
            name: 'Ahmed Khan',
            email: 'ahmed.khan@example.com',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            attendance: 12,
            enrollmentDate: '2023-01-15',
        },
        
    ]);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchText.toLowerCase()) ||
        student.email.toLowerCase().includes(searchText.toLowerCase())
    );

    const showDeleteConfirm = (student) => {
        setStudentToDelete(student);
        setIsModalVisible(true);
    };

    const handleDelete = () => {
        setStudents(students.filter(student => student.key !== studentToDelete.key));
        message.success(`Student ${studentToDelete.name} removed successfully`);
        setIsModalVisible(false);
        setStudentToDelete(null);
    };

    const handleAddLink = () => {
        if (!classLink.trim()) {
            message.error("Class link cannot be empty");
            return;
        }
        message.success(`Class link added: ${classLink}`);
        setLinkModalVisible(false);
        setClassLink('');
    };

    const columns = [
        {
            title: 'Student',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div className="flex items-center">
                    <Avatar src={record.avatar} icon={<UserOutlined />} className="mr-5" />
                    <div>
                        <p className="font-medium text-gray-800 ml-3">{text}</p>
                        <p className="text-gray-500 text-xs ml-3">{record.email}</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Attendance',
            dataIndex: 'attendance',
            key: 'attendance',
            render: (attendance) => (
                <Tag color="blue" className="capitalize">
                    {attendance} Days
                </Tag>
            ),
        },
        {
            title: 'Enrollment Date',
            dataIndex: 'enrollmentDate',
            key: 'enrollmentDate',
            render: (date) => <span className="text-gray-600">{date}</span>,
        },
        {
            title: 'Action',
            dataIndex: 'actione',
            key: 'action',
            render: (date) =>  <Button
            type="primary"
            icon={<LinkOutlined />}
            onClick={() => setLinkModalVisible(true)}
            className="bg-blue-600"
        >
            Add Class Link
        </Button>,
        }
    ];

    return (
        <>
            <center>
                <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Class : Hifz</h1>
            </center>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">All Enrolled Students</h1>
                    <div className="flex flex-col md:flex-row gap-2 items-center">
                        <Input
                            placeholder="Search students..."
                            prefix={<SearchOutlined className="text-gray-400" />}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="rounded-lg w-full md:w-64"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={filteredStudents}
                        pagination={{ pageSize: 5 }}
                        rowClassName="hover:bg-gray-50"
                        className="antd-table-custom"
                        scroll={{ x: '100%' }}
                    />
                </div>

                {/* Add Class Link Modal */}
                <Modal
                    title="Add Class Link"
                    open={linkModalVisible}
                    onOk={handleAddLink}
                    onCancel={() => setLinkModalVisible(false)}
                    okText="Add Link"
                    centered
                >
                    <Input
                        placeholder="Enter class link..."
                        value={classLink}
                        onChange={(e) => setClassLink(e.target.value)}
                    />
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal
                    title="Confirm Removal"
                    open={isModalVisible}
                    onOk={handleDelete}
                    onCancel={() => setIsModalVisible(false)}
                    okText="Remove"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                    centered
                >
                    {studentToDelete && (
                        <div className="flex flex-col items-center py-4">
                            <Avatar src={studentToDelete.avatar} size={64} className="mb-3" />
                            <p className="text-lg font-medium text-gray-800 mb-1">{studentToDelete.name}</p>
                            <p className="text-gray-600 mb-4">{studentToDelete.email}</p>
                            <p className="text-center">
                                Are you sure you want to remove this student? This action cannot be undone.
                            </p>
                        </div>
                    )}
                </Modal>

                {/* Table custom styling */}
                <style>{`
                    .antd-table-custom .ant-table-thead > tr > th {
                        background-color: #f8fafc;
                        color: #64748b;
                        font-weight: 600;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    .antd-table-custom .ant-table-tbody > tr > td {
                        border-bottom: 1px solid #f1f5f9;
                    }
                    .antd-table-custom .ant-pagination-item-active {
                        border-color: #6366f1;
                    }
                    .antd-table-custom .ant-pagination-item-active a {
                        color: #6366f1;
                    }
                `}</style>
            </div>
        </>
    );
};

export default EnrolledStudent;
