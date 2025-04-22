import React, { useState } from 'react';
import { Table, Avatar, Button, Modal, Space, Tag, Input, Tooltip, message } from 'antd';
import { SearchOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons';

const EnrolledStudent = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [searchText, setSearchText] = useState('');

    // Dummy student data
    const [students, setStudents] = useState([
        {
            key: '1',
            name: 'Ahmed Khan',
            email: 'ahmed.khan@example.com',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            attendance : 12,
            enrollmentDate: '2023-01-15',
        },
        {
            key: '2',
            name: 'Fatima Ali',
            email: 'fatima.ali@example.com',
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
            attendance : 12,
            enrollmentDate: '2023-02-20',
        },
        {
            key: '3',
            name: 'Mohammed Hassan',
            email: 'mohammed.h@example.com',
            avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
            attendance : 12,
            enrollmentDate: '2023-03-10',
        },
        {
            key: '4',
            name: 'Aisha Rahman',
            email: 'aisha.r@example.com',
            avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
            attendance : 12,
            enrollmentDate: '2023-04-05',
        },
        {
            key: '5',
            name: 'Ibrahim Malik',
            email: 'ibrahim.m@example.com',
            avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
            attendance : 12,
            enrollmentDate: '2023-05-12',
        },
        {
            key: '6',
            name: 'Zainab Omar',
            email: 'zainab.o@example.com',
            avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
            attendance : 12,
            enrollmentDate: '2023-06-18',
        },
    ]);

    // Filter students based on search text
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

    const handleCancelDelete = () => {
        setIsModalVisible(false);
        setStudentToDelete(null);
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
                <Tag color={attendance === 'present' ? 'green' : 'red'} className="capitalize">
                    {attendance}
                </Tag>
            ),
        },
        {
            title: 'Enrollment Date',
            dataIndex: 'enrollmentDate',
            key: 'enrollmentDate',
            render: (date) => <span className="text-gray-600">{date}</span>,
        },
    ];
    
    return (
        <>

            <center>
            <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Class : Hifz</h1>
            </center>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">All Enrolled Students</h1>
                    <div className="w-full md:w-64">
                        <Input
                            placeholder="Search students..."
                            prefix={<SearchOutlined className="text-gray-400" />}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="rounded-lg"
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
                        scroll={{ "x": "100%" }}
                    />
                </div>

                {/* Delete Confirmation Modal */}
                <Modal
                    title="Confirm Removal"
                    open={isModalVisible}
                    onOk={handleDelete}
                    onCancel={handleCancelDelete}
                    okText="Remove"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                    centered
                >
                    {studentToDelete && (
                        <div className="flex flex-col items-center py-4">
                            <Avatar
                                src={studentToDelete.avatar}
                                size={64}
                                icon={<UserOutlined />}
                                className="mb-3"
                            />
                            <p className="text-lg font-medium text-gray-800 mb-1">{studentToDelete.name}</p>
                            <p className="text-gray-600 mb-4">{studentToDelete.email}</p>
                            <p className="text-center">
                                Are you sure you want to remove this student? This action cannot be undone.
                            </p>
                        </div>
                    )}
                </Modal>

                {/* Custom CSS for table */}
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