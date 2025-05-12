import React, { useEffect, useState } from 'react';
import {
    Table,
    Card,
    Statistic,
    Avatar,
    Skeleton,
    message
} from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    BookOutlined
} from '@ant-design/icons';
import axiosInstance from '../../Axios/axiosInstance';

const TeacherDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosInstance.get(`/teacher-dashboard/681c8fec632958724453534e`);
                setDashboardData(data);
                // console.log()
            } catch (err) {
                message.error("Failed to fetch dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'profileUrl',
            key: 'profileUrl',
            render: (url) => <Avatar src={url || 'https://i.pravatar.cc/150?img=1'} />
        },
        {
            title: 'Student Name',
            dataIndex: 'fullName',
            key: 'fullName'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Timing',
            dataIndex: 'timing',
            key: 'timing'
        }
    ];

    const { totalStudents, totalClasses, nextStudent, students } = dashboardData || {};

    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="text-center">
                    {loading ? (
                        <Skeleton active />
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <TeamOutlined className="text-green-700 text-2xl" />
                            <div>
                                <div className="text-sm text-gray-500">Total Students</div>
                                <div className="text-xl font-semibold text-green-700">{totalStudents}</div>
                            </div>
                        </div>
                    )}
                </Card>

                <Card className="text-center">
                    {loading ? (
                        <Skeleton active />
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <BookOutlined className="text-green-700 text-2xl" />
                            <div>
                                <div className="text-sm text-gray-500">Total Class</div>
                                <div className="text-xl font-semibold text-green-700">{totalClasses}</div>
                            </div>
                        </div>
                    )}
                </Card>


                <Card>
                    {loading ? (
                        <Skeleton active />
                    ) : (
                        <>
                            <div className="flex items-center justify-center space-x-2">
                                <span className="h-2 w-2 rounded-full bg-yellow-500 animate-ping"></span>
                                <Statistic
                                    title="Next Student"
                                    value={nextStudent?.fullName || 'N/A'}
                                    prefix={<UserOutlined />}
                                    valueStyle={{ color: '#faad14' }}
                                />
                            </div>
                            <div className="mt-2 text-gray-500 text-sm text-center">
                                Timing: {nextStudent?.timing || 'N/A'}
                            </div>
                        </>
                    )}
                </Card>

            </div>

            <Card title="Student Classes Schedule">
                <Table
                    columns={columns}
                    dataSource={loading ? [] : students?.map((s, i) => ({ ...s, key: i }))}
                    loading={loading}
                    scroll={{ x: '100%' }}
                />
            </Card>
        </div>
    );
};

export default TeacherDashboard;
