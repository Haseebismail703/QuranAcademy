import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Axios/axiosInstance';
import {
    Table,
    Avatar,
    Button,
    Modal,
    Space,
    Tag,
    Input,
    Tooltip,
    message,
    Select
} from 'antd';
import {
    SearchOutlined,
    PlusCircleTwoTone,
} from '@ant-design/icons';
import { useParams, useLocation } from 'react-router-dom';

const { Option } = Select;

const AllStudentsPage = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [studentAddKey, setStudentAddKey] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [students, setStudents] = useState([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const { courseId } = useParams();
    const location = useLocation();
    const classData = location.state;

    // Fetch students from backend
    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get(`/getWaitingStudentCourseId/${courseId}`);
            const studentsData = res.data?.waitingStudent?.map((student) => ({
                ...student,
            })) || [];
            
            setStudents(studentsData);
            setAvailableTimeSlots(res.data?.remainingSlots || []);
        } catch (error) {
            message.error('Failed to fetch students');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [courseId]);

    // Filter students
    const filteredStudents = students.filter((student) =>
        (student.firstName?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
        (student.email?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
        (student._id?.toString() || '').includes(searchText.toLowerCase())
    );

    const showAddModal = (student) => {
        setStudentAddKey(student);
        setSelectedTimeSlot(null); // Reset selection when modal opens
        setIsModalVisible(true);
    };

    const handleAdd = async () => {
        if (!selectedTimeSlot) {
            message.error('Please select a time slot');
            return;
        }

        try {
            const payload = {
                classId :  classData.singleClass._id,
                studentId: studentAddKey._id,
                timing: selectedTimeSlot,
            };
            // console.log('Payload:', payload); // Debugging line
            await axiosInstance.post('/addStudentToClass', payload);
            message.success(`Student ${studentAddKey.firstName} added successfully`);
            setIsModalVisible(false);
            setStudentAddKey(null);
            fetchStudents(); // Refresh the list
        } catch (error) {
            message.error('Failed to add student');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setStudentAddKey(null);
        setSelectedTimeSlot(null);
    };

    const columns = [
        {
            title: 'No',
            dataIndex: 'index',
            key: 'index',
            render: (_, __, index) => <span>{index + 1}</span>,
        },
        {
            title: 'Student',
            dataIndex: 'firstName',
            key: 'firstName',
            render: (text, record) => (
                <div className="flex items-center">
                    <Avatar
                        src={record.profileUrl?.trim() || null}
                        icon={!record.profileUrl?.trim() ? 
                            (record.gender === 'female' ? "👩" : "👨") : null}
                        className="mr-5"
                    />
                    <div>
                        <p className="font-medium text-gray-800 ml-3">{text}</p>
                        <p className="text-gray-500 text-xs ml-3">{record.email}</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            render: (gender) => (
                <Tag color={gender === 'female' ? 'magenta' : 'blue'} className="capitalize">
                    {gender || 'N/A'}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'volcano'} className="capitalize">
                    {status || 'N/A'}
                </Tag>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => (
                <span className="text-gray-600">
                    {date ? new Date(date).toLocaleDateString() : 'N/A'}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Add student">
                        <Button
                            shape="circle"
                            icon={<PlusCircleTwoTone />}
                            onClick={() => showAddModal(record)}
                            className="text-red-500 hover:bg-red-50 border-red-200"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Class Header */}
                <div className="class-header-container bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            {classData?.singleClass.courseId.courseName || 'Class'}
                        </h1>
                        
                        <div className="flex justify-center items-center gap-4 mb-3">
                            <div className="flex items-center text-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-lg font-medium text-gray-700">
                                    {classData?.singleClass?.classTiming || 'Timing not specified'}
                                </span>
                            </div>
                        </div>

                        <div className="instructor-badge inline-flex items-center bg-white px-4 py-2 rounded-full shadow-xs border border-gray-200 gap-2">
                            <Avatar
                                size="small"
                                src={classData?.singleClass.teacherId.profilePicture}
                                className="mr-2"
                            >
                                {classData?.singleClass.teacherId.firstName?.charAt(0) || 'T'}
                            </Avatar>
                            <span className="text-gray-700">
                                <span className="font-medium">Instructor:</span> {classData?.singleClass.teacherId.firstName || 'Unknown'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Students Table */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">
                            All Waiting Students
                        </h2>
                        <div className="w-full md:w-64">
                            <Input
                                placeholder="Search students by name, email or ID"
                                prefix={<SearchOutlined className="text-gray-400" />}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="rounded-lg"
                                allowClear
                            />
                        </div>
                    </div>

                    <Table
                        rowKey="_id"
                        columns={columns}
                        dataSource={filteredStudents}
                        pagination={{ pageSize: 5 }}
                        loading={isLoading}
                        rowClassName="hover:bg-gray-50"
                        className="antd-table-custom"
                        scroll={{ x: '100%' }}
                    />
                </div>

                {/* Add Student Modal */}
                <Modal
                    title="Confirm Student Addition"
                    open={isModalVisible}
                    onOk={handleAdd}
                    onCancel={handleCancel}
                    okText="Add"
                    cancelText="Cancel"
                    centered
                >
                    {studentAddKey && (
                        <div className="flex flex-col items-center py-4">
                            <Avatar
                                src={studentAddKey.profileUrl?.trim() || null}
                                icon={!studentAddKey.profileUrl?.trim() ? 
                                    (studentAddKey.gender === 'female' ? "👩" : "👨") : null}
                                size={64}
                                className="mb-3"
                            />
                            <p className="text-lg font-medium text-gray-800 mb-1">
                                {studentAddKey.firstName} {studentAddKey.lastName}
                            </p>
                            <p className="text-gray-600 mb-4">{studentAddKey.email}</p>
                            
                            <p className="text-center mb-3">Select available time slot:</p>
                            
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Select time slot"
                                value={selectedTimeSlot}
                                onChange={setSelectedTimeSlot}
                            >
                                {availableTimeSlots.map((slot, index) => (
                                    <Option key={index} value={slot}>
                                        {slot}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    )}
                </Modal>

                <style >{`
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
        </div>
    );
};

export default AllStudentsPage;