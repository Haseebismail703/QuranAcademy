import React, { useState, useEffect } from 'react';
import { Table, Avatar, Button, Modal, Space, Tag, Input, Tooltip, message, Spin, Empty } from 'antd';
import { SearchOutlined, DeleteOutlined, LinkOutlined, CopyOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axiosInstance from '../../Axios/axiosInstance';
import { useParams } from 'react-router-dom';

const EnrolledStudent = () => {
    const [searchText, setSearchText] = useState('');
    const [linkModalVisible, setLinkModalVisible] = useState(false);
    const [classLink, setClassLink] = useState('');
    const [students, setStudents] = useState([]);
    const [courseName, setCourseName] = useState('');
    const [classTiming, setClassTiming] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [linkLoading, setLinkLoading] = useState(false);

    const { classId } = useParams();

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get(`/getJoinStudentByClassId/${classId}`);
            setCourseName(data?.courseId?.courseName || '');
            setClassTiming(data?.classTiming || '');

            const mappedStudents = data?.students?.map((item, index) => ({
                key: index + 1,
                _id: item?.studentId?._id,
                name: item?.studentId?.firstName || 'Unknown',
                email: item?.studentId?.email || '',
                profileUrl: item?.studentId?.profileUrl,
                studentTiming: item?.studentTiming || 'Not specified',
                enrollmentDate: new Date(item?.addedAt).toLocaleDateString(),
                gender: item?.studentId?.gender || 'unknown',
                classLink: item?.classLink || null,
            }));

            setStudents(mappedStudents || []);
        } catch (err) {
            message.error('Failed to load student data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [classId]);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchText.toLowerCase()) ||
        student.email.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleAddLink = async () => {
        if (!selectedStudent || !classLink.trim()) {
            message.error('Please enter a valid class link.');
            return;
        }
        console.log(selectedStudent)
        try {
            setLinkLoading(true);
            await axiosInstance.put(`/addClassLink/${selectedStudent._id}`, {
                classLink: classLink.trim(),
                teacherId : '681c8fec632958724453534e'
            });
            message.success('Class link added successfully!');
            setLinkModalVisible(false);
            fetchData();
        } catch (err) {
            message.error('Failed to add class link.');
            console.error(err);
        } finally {
            setLinkLoading(false);
        }
    };

    const handleRemoveClassLink = async () => {
        if (!selectedStudent) return;

        try {
            setLinkLoading(true);
            await axiosInstance.put(`/addClassLink/${selectedStudent._id}`, {
                classLink: '',
                 teacherId : '681c8fec632958724453534e'
            });
            message.success('Class link removed successfully!');
            setLinkModalVisible(false);
            fetchData();
        } catch (err) {
            message.error('Failed to remove class link.');
            console.error(err);
        } finally {
            setLinkLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(classLink)
            .then(() => message.success('Link copied to clipboard!'))
            .catch(() => message.error('Failed to copy link'));
    };

    const columns = [
        {
            title: 'No',
            dataIndex: 'key',
            key: 'key',
            width: 60,
            align: 'center',
        },
        {
            title: 'Student',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        src={record.profileUrl || null}
                        icon={!record.profileUrl ?
                            (record.gender === 'female' ? "👩" : "👨") : null}
                        className="mr-3"
                    />
                    <div>
                        <p className="font-medium text-gray-800">{text}</p>
                        <p className="text-gray-500 text-xs">{record.email}</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            render: (gender) => (
                <Tag color={gender === 'female' ? 'pink' : 'blue'} className="capitalize">
                    {gender || 'unknown'}
                </Tag>
            ),
        },
        {
            title: 'Timing',
            dataIndex: 'studentTiming',
            key: 'studentTiming',
            render: (time) => (
                <Tag color="green" className="capitalize">
                    {time}
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
            title: 'Class Link',
            key: 'classLink',
            render: (_, record) => (
                <Tag color={record.classLink ? 'green' : 'orange'}>
                    {record.classLink ? 'Available' : 'Not set'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<LinkOutlined />}
                        onClick={() => {
                            setSelectedStudent(record);
                            setClassLink(record.classLink || '');
                            setLinkModalVisible(true);
                        }}
                        className={record.classLink ? "bg-green-600" : "bg-blue-600"}
                    >
                        {record.classLink ? 'View Link' : 'Add Link'}
                    </Button>
                </Space>
            ),
        }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {courseName || 'Course Details'}
                </h1>
                <p className="text-gray-500 text-lg">
                    <ClockCircleOutlined className="mr-2" />
                    {classTiming || 'Timing not specified'}
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                        Enrolled Students ({students.length})
                    </h2>
                    <Input
                        placeholder="Search students..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="rounded-lg w-full md:w-56 h-10 text-sm"
                        allowClear
                        size="middle"
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredStudents}
                    pagination={{
                        pageSize: 5,
                        showSizeChanger: false,
                        hideOnSinglePage: true
                    }}
                    rowClassName="hover:bg-gray-50"
                    scroll={{ x: true }}
                    locale={{
                        emptyText: (
                            <Empty
                                description="No students enrolled yet"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        )
                    }}
                />
            </div>

            {/* Link Management Modal */}
            <Modal
                title={
                    selectedStudent?.classLink
                        ? 'Manage Class Link'
                        : 'Add Class Link for ' + (selectedStudent?.name || 'Student')
                }
                open={linkModalVisible}
                onCancel={() => {
                    setLinkModalVisible(false);
                    setClassLink('');
                }}
                footer={[
                    selectedStudent?.classLink ? (
                        <Button
                            key="remove"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={handleRemoveClassLink}
                            loading={linkLoading}
                        >
                            Remove Link
                        </Button>
                    ) : (
                        <Button
                            key="add"
                            type="primary"
                            icon={<LinkOutlined />}
                            onClick={handleAddLink}
                            loading={linkLoading}
                            disabled={!classLink.trim()}
                        >
                            Save Link
                        </Button>
                    ),
                    <Button
                        key="cancel"
                        onClick={() => setLinkModalVisible(false)}
                    >
                        Cancel
                    </Button>
                ]}
                centered
                destroyOnClose
            >
                {selectedStudent?.classLink ? (
                    <div className="space-y-4">
                        <p className="font-medium">Current Link:</p>
                        <div className="flex items-center gap-2">
                            <Input
                                value={classLink}
                                readOnly
                                className="flex-1"
                            />
                            <Tooltip title="Copy link">
                                <Button
                                    icon={<CopyOutlined />}
                                    onClick={copyToClipboard}
                                />
                            </Tooltip>
                        </div>
                        <div className="mt-4">
                            <Button
                                type="link"
                                href={classLink}
                                target="_blank"
                                className="p-0"
                            >
                                Open link in new tab
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-gray-600 mb-2">
                            Enter the class link for {selectedStudent?.name || 'this student'}:
                        </p>
                        <Input
                            placeholder="https://meet.google.com/xyz-abcd-123"
                            value={classLink}
                            onChange={(e) => setClassLink(e.target.value)}
                            allowClear
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Example: Google Meet, Zoom, or other virtual classroom links
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default EnrolledStudent;