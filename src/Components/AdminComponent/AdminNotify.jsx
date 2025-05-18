import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Dropdown, Space, Typography,message } from 'antd';
import { BellTwoTone, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import socket from '../../utils/socket.js';

const { Text } = Typography;

const AdminNotify = () => {
  const [notifications, setNotifications] = useState([]);

   let adminId = '681c8fc56329587244535343'
  useEffect(() => {
    // Fetch notifications via Axios
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/getNotify/681c8fc56329587244535343'); // replace with actual API
        console.log(res.data)
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
  }, [adminId]);


  useEffect(() => {
    const handleReceiveNotification = (notify) => {
      if (notify.receiverId.includes(adminId)) {
        message.success("New notification received");
        setNotifications(prev => [notify, ...prev]);
        // setUnreadCount((prev) => prev + 1); // ✅ increment unread
      }
    };

    socket.on("receiveNotification", handleReceiveNotification);

    return () => socket.off("receiveNotification", handleReceiveNotification);
  }, []);

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
        {notifications.length === 0 ? (
          <div style={{ padding: '16px', textAlign: 'center', color: '#aaa' }}>No notifications</div>
        ) : (
          notifications.map(notif => (
            <div key={notif._id} style={{
              padding: '12px 16px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <Avatar size="large" src={notif.senderId?.profileUrl || 'https://cdn-icons-png.flaticon.com/512/1828/1828665.png'} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>
                  {notif.senderId?.role === 'teacher' ? 'Teacher' : 'System'}
                </div>
                <div style={{ color: '#888', fontSize: 12 }}>{notif.message}</div>
                <div style={{ color: '#aaa', fontSize: 11, marginTop: 4 }}>
                  {moment(notif.created_at).fromNow()}
                </div>
              </div>
              <CloseOutlined style={{ fontSize: 12, color: '#888', cursor: 'pointer' }} />
            </div>
          ))
        )}
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
      <Badge count={notifications.length} size="small">
        <BellTwoTone twoToneColor="#1890ff" style={{ fontSize: 22, cursor: 'pointer' }} />
      </Badge>
    </Dropdown>
  );
};

export default AdminNotify;
