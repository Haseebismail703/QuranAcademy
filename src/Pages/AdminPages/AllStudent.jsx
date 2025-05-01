import React, { useEffect, useState } from 'react';
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
} from 'antd';
import {
    SearchOutlined,
    UserOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import axiosInsteance from '../../Axios/axiosInstance.js';
import { useParams } from 'react-router-dom';

const AllStudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { classId } = useParams();

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await axiosInsteance.get(`/getClassWithStudents/${classId}`);
            const classInfo = res.data.classData;
            setClassData({
                courseName: classInfo?.courseId?.courseName || 'N/A',
                teacherName: classInfo?.teacherId?.firstName || 'N/A',
                classTiming: classInfo?.classTiming || 'N/A',
            });

            const studentsData = classInfo?.students?.map((entry) => {
                const { studentId, studentTiming, addedAt, _id } = entry;
                return {
                    ...studentId,
                    studentTiming: studentTiming || 'N/A',
                    enrollmentDate: new Date(addedAt).toLocaleDateString(),
                    classStudentId: _id,
                };
            }) || [];

            setStudents(studentsData);
            setFilteredStudents(studentsData);
        } catch (err) {
            console.error(err);
            message.error('Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        const filtered = students.filter(
            (student) =>
                student.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
                student.email?.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredStudents(filtered);
    }, [searchText, students]);

    const showDeleteConfirm = (student) => {
        setStudentToDelete(student);
        setIsModalVisible(true);
    };

    const handleDelete = async () => {
        if (!studentToDelete) return;
        // console.log('Deleting student:', studentToDelete);
        try {
            await axiosInsteance.post(`/removeStudentFromClass`, {
                classId: classId,
                studentId: studentToDelete._id,
            });
            message.success(`Student ${studentToDelete.firstName} removed successfully`);
            fetchStudents();
        } catch (err) {
            message.error('Failed to delete student');
        } finally {
            setIsModalVisible(false);
            setStudentToDelete(null);
        }
    };

    const columns = [
        {
            title: 'S.No',
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
                        icon={!record.profileUrl?.trim() ? (record.gender === 'female' ? "👩" : "👨") : null}

                    />
                    <div>
                        <p className="font-medium text-gray-800 ml-3">{text}</p>
                        <p className="text-gray-500 text-xs ml-3">{record.email}</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Student Timing',
            dataIndex: 'studentTiming',
            key: 'studentTiming',
            render: (timing) => <span className="text-gray-600">{timing}</span>,
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            render: (gender) => (
                <Tag color={gender === 'male' ? 'green' : 'geekblue'} className="capitalize">
                    {gender}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'} className="capitalize">
                    {status}
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
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Remove this student">
                        <Button
                            shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={() => showDeleteConfirm(record)}
                            className="text-red-500 hover:bg-red-50 border-red-200"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <>
            <center>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">All Enrolled Students</h1>
            </center>

            {classData && (
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-6 shadow-lg border border-blue-300 mb-6">
                    <h2 className="text-xl font-semibold text-blue-800 mb-4 border-b pb-2">📘 Class Details</h2>
                    <div className="space-y-2 text-blue-900">
                        <p>
                            <span className="font-bold">📚 Course Name:</span> {classData.courseName}
                        </p>
                        <p>
                            <span className="font-bold">👨‍🏫 Teacher Name:</span> {classData.teacherName}
                        </p>
                        <p>
                            <span className="font-bold">⏰ Class Timing:</span> {classData.classTiming}
                        </p>
                    </div>
                </div>
            )}


            <div className="container mx-auto px-4 py-8">


                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">
                        🎓 Student List
                    </h2>
                    <div className="w-full md:w-64">
                        <Input
                            placeholder="Search students by name, email "
                            prefix={<SearchOutlined className="text-gray-400" />}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="rounded-lg"
                            allowClear
                        />
                    </div>
                </div>



                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={filteredStudents}
                        loading={loading}
                        pagination={{ pageSize: 5 }}
                        rowKey="_id"
                        rowClassName="hover:bg-gray-50"
                        className="antd-table-custom"
                        scroll={{ x: '100%' }}
                    />
                </div>

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
                            <Avatar
                                src={studentToDelete.profileUrl?.trim() || null}
                                icon={!studentToDelete.profileUrl?.trim() ? (studentToDelete.gender === 'female' ? "👩" : "👨") : null}
                                size={64}
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

export default AllStudentsPage;
