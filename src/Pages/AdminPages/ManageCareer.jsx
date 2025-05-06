import React, { useState, useEffect } from 'react';
import { Table, Avatar, message, Divider, Card, Typography, Space, Spin } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import axiosInstance from '../../Axios/axiosInstance';

const { Title, Text } = Typography;

const CareersPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/getAllCareer');
            let getCareer = response.data.map((data, index) => ({
                ...data,
                key: index, 
            }));
            console.log(response.data)
            setApplications(getCareer);
        } catch (error) {
            message.error('Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return '';
        const names = name.split(' ');
        return names.map((n) => n[0]).join('').toUpperCase();
    };

    const columns = [
        {
            title: 'Applicant',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Avatar style={{ backgroundColor: '#1890ff' }}>{getInitials(text)}</Avatar>
                    <span>{text}</span>
                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email) => <a href={`mailto:${email}`}>{email}</a>,
        },
        {
            title: 'Phone',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'Applied On',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render : (createdAt) =>(
                <p>{createdAt?.slice(0,10)}</p>
            )
        },
    ];

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
                Recent Applications
            </Title>

            <Divider orientation="left">
                <Text strong style={{ fontSize: '18px' }}>Applications</Text>
            </Divider>

            <Spin spinning={loading}>
                <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <Table
                        columns={columns}
                        dataSource={applications}
                        rowKey="_id"
                        loading={loading}
                        pagination={{ pageSize: 5 }}
                        scroll={{"x" : "100%"}}
                    />
                </Card>
            </Spin>
        </div>
    );
};

export default CareersPage;
