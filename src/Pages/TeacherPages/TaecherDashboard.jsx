import React, { useState } from 'react';
import {
    Table,
    Button,
    Card,
    Statistic,
    Tag,
    Space,
    Avatar
} from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    BookOutlined
} from '@ant-design/icons';

const TeacherDashboard = () => {
    const [students] = useState([
        {
            key: '1',
            name: 'Ali Khan',
            className: 'Class 10',
            course: 'Mathematics',
            timing: '10:00 AM - 11:00 AM',
            email: 'ali.khan@example.com',
            avatar: 'https://i.pravatar.cc/150?img=1'
        },
        {
            key: '2',
            name: 'Fatima Noor',
            className: 'Class 9',
            course: 'Physics',
            timing: '11:00 AM - 12:00 PM',
            email: 'fatima.noor@example.com',
            avatar: 'https://i.pravatar.cc/150?img=2'
        },
        {
            key: '3',
            name: 'Ahmed Raza',
            className: 'Class 10',
            course: 'Computer Science',
            timing: '12:00 PM - 01:00 PM',
            email: 'ahmed.raza@example.com',
            avatar: 'https://i.pravatar.cc/150?img=3'
        },
    ]);

    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (avatar) => <Avatar src={avatar} />
        },
        {
            title: 'Student Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Class Name',
            dataIndex: 'className',
            key: 'className'
        },
        {
            title: 'Course',
            dataIndex: 'course',
            key: 'course'
        },
        {
            title: 'Timing',
            dataIndex: 'timing',
            key: 'timing'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="link">View</Button>
                </Space>
            )
        }
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <Statistic
                        title="Total Students"
                        value={students.length}
                        prefix={<TeamOutlined />}
                        valueStyle={{ color: '#3f8600' }}
                    />
                </Card>
                <Card>
                    <Statistic
                        title="Total Classes"
                        value={new Set(students.map((s) => s.className)).size}
                        prefix={<BookOutlined />}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Card>
                <Card>
                    <Statistic
                        title="Next Student"
                        value={students[0]?.name || 'N/A'}
                        prefix={<UserOutlined />}
                        valueStyle={{ color: '#faad14' }}
                    />
                </Card>
            </div>

            <Card title="Student Classes Schedule">
                <Table columns={columns} dataSource={students}  scroll={{"x" : "100%"}} />
            </Card>
        </div>
    );
};

export default TeacherDashboard;