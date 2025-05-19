import React, { useEffect, useState } from 'react';
import {
    Table,
    Card,
    Statistic,
    Avatar,
    Skeleton,
    message,
    Row,
    Col,
    Tag
} from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    BookOutlined,
    ScheduleOutlined
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
            key: 'timing',
            render: (timing) => (
                <Tag color='#b7eb8f' style={{ color: '#222' }}>
                    {timing}
                </Tag>
            )
        }
    ];

    const { totalStudents, totalClasses, nextStudent, students, averageAttendance } = dashboardData || {};

    // Card border colors and equal height
    const cardStyles = [
        { borderLeft: '4px solid #a7d8ff', hover: '#e6f7ff', iconColor: '#1890ff' }, // Light blue
        { borderLeft: '4px solid #b7eb8f', hover: '#f6ffed', iconColor: '#52c41a' }, // Light green
        { borderLeft: '4px solid #ffd591', hover: '#fff7e6', iconColor: '#fa8c16' }, // Light orange
        { borderLeft: '4px solid #d3adf7', hover: '#f9f0ff', iconColor: '#722ed1' }  // Light purple
    ];

    return (
        <div style={{ padding: '24px' }}>
            {/* Stats Cards Row */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                {[
                    {
                        title: 'Average Attendance',
                        value: averageAttendance,
                        icon: <TeamOutlined />,
                        index: 0,
                    },
                    {
                        title: 'Total Students',
                        value: totalStudents,
                        icon: <TeamOutlined />,
                        index: 1
                    },
                    {
                        title: 'Total Classes',
                        value: totalClasses,
                        icon: <BookOutlined />,
                        index: 2
                    },
                    {
                        title: 'Next Student',
                        value: nextStudent?.fullName || 'N/A',
                        icon: <ScheduleOutlined />,
                        index: 3,
                        subText: nextStudent?.timing || 'N/A',
                        isNextStudent: true
                    }
                ].map((item) => (
                    <Col xs={24} sm={12} md={12} lg={6} key={item.title}>
                        <Card 
                            hoverable
                            style={{ 
                                ...cardStyles[item.index],
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                           
                        >
                            {loading ? (
                                <Skeleton active paragraph={{ rows: 0 }} />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{
                                        background: cardStyles[item.index].hover,
                                        borderRadius: '50%',
                                        padding: '12px',
                                        marginRight: '16px',
                                        position: 'relative'
                                    }}>
                                        {item.isNextStudent && (
                                            <span className="pulse-dot" style={{
                                                position: 'absolute',
                                                top: '-3px',
                                                right: '-3px',
                                                width: '10px',
                                                height: '10px',
                                                borderRadius: '50%',
                                                background: '#ff4d4f',
                                                border: '2px solid white'
                                            }}></span>
                                        )}
                                        {React.cloneElement(item.icon, { 
                                            style: { 
                                                fontSize: '24px', 
                                                color: cardStyles[item.index].iconColor 
                                            } 
                                        })}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: '#8c8c8c', fontSize: '14px' }}>
                                            {item.title}
                                        </div>
                                        <div style={{ 
                                            fontSize: item.isNextStudent ? '18px' : '24px', 
                                            fontWeight: 600, 
                                            color: cardStyles[item.index].iconColor,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {item.value}{item.suffix || ''}
                                        </div>
                                        {item.subText && (
                                            <div style={{ 
                                                color: '#8c8c8c', 
                                                fontSize: '12px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {item.subText}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Student Schedule Table */}
            <Card 
                title="Student Classes Schedule" 
            >
                <Table
                    columns={columns}
                    dataSource={loading ? [] : students?.map((s, i) => ({ ...s, key: i }))}
                    loading={loading}
                    scroll={{ x: 'max-content' }}
                    pagination={{ pageSize: 5 }}
                />
            </Card>
        </div>
    );
};

export default TeacherDashboard;