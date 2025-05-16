import React from 'react';
import { Avatar, Badge, Dropdown, Space, Typography } from 'antd';
import { BellTwoTone, CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

const notificationData = [
  {
    id: 1,
    name: 'Ali Khan',
    message: 'New teacher request received.',
    time: '2 mins ago',
    type: 'NEW',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 2,
    name: 'React Course',
    message: 'React Advanced has been added.',
    time: '10 mins ago',
    type: 'NEW',
    avatar: 'https://img.icons8.com/color/48/000000/react-native.png',
  },
  {
    id: 3,
    name: 'System',
    message: 'System update scheduled at 10PM.',
    time: '1 hour ago',
    type: 'EARLIER',
    avatar: 'https://cdn-icons-png.flaticon.com/512/1828/1828665.png',
  },
];

const TeacherNotify = () => {
  const content = (
    <div style={{ width: 350, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <Text strong>Notifications</Text>
        <Space>
          <Text type="secondary" style={{ cursor: 'pointer', fontSize: 12 }}>mark as read</Text>
          <Text type="secondary" style={{ cursor: 'pointer', fontSize: 12 }}>clear all</Text>
        </Space>
      </div>

      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        <div style={{ padding: '8px 16px', backgroundColor: '#f5f5f5' }}>
          <Text strong>NEW</Text>
        </div>
        {notificationData.filter(n => n.type === 'NEW').map(notification => (
          <div key={notification.id} style={{
            padding: '12px 16px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <Avatar size="large" src={notification.avatar} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500 }}>{notification.name}</div>
              <div style={{ color: '#888', fontSize: 12 }}>{notification.message}</div>
              <div style={{ color: '#aaa', fontSize: 11, marginTop: 4 }}>{notification.time}</div>
            </div>
            <CloseOutlined style={{ fontSize: 12, color: '#888', cursor: 'pointer' }} />
          </div>
        ))}

        <div style={{ padding: '8px 16px', backgroundColor: '#f5f5f5' }}>
          <Text strong>EARLIER</Text>
        </div>
        {notificationData.filter(n => n.type === 'EARLIER').map(notification => (
          <div key={notification.id} style={{
            padding: '12px 16px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <Avatar size="large" src={notification.avatar} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500 }}>{notification.name}</div>
              <div style={{ color: '#888', fontSize: 12 }}>{notification.message}</div>
              <div style={{ color: '#aaa', fontSize: 11, marginTop: 4 }}>{notification.time}</div>
            </div>
            <CloseOutlined style={{ fontSize: 12, color: '#888', cursor: 'pointer' }} />
          </div>
        ))}
      </div>

      <div style={{
        padding: '12px 16px',
        textAlign: 'center',
        borderTop: '1px solid #f0f0f0',
        cursor: 'pointer'
      }}>
        <Text type="primary">Show all</Text>
      </div>
    </div>
  );

  return (
    <Dropdown dropdownRender={() => content} trigger={['click']} placement="bottomRight" arrow>
      <Badge count={notificationData.length} size="small">
        <BellTwoTone twoToneColor="#1890ff" style={{ fontSize: 22, cursor: 'pointer' }} />
      </Badge>
    </Dropdown>
  );
};

export default TeacherNotify;
