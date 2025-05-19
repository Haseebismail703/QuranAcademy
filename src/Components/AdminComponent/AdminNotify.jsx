import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Dropdown, Space, Typography, message, Grid } from 'antd';
import { BellTwoTone, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import socket from '../../utils/socket.js';
import useSound from 'use-sound';
import notifyTone from '../../assets/notify.wav'
const { Text } = Typography;

const AdminNotify = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [playNotifyTone] = useSound(notifyTone)
  let navigate = useNavigate()
  const adminId = '681c8fc56329587244535343';
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const placement = screens.xs ? 'bottom' : 'bottomRight';
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/getNotify/${adminId}`);
      const unread = res.data.filter(n => !n.readBy).length;
      console.log(res.data)
      setNotifications(res.data);
      setUnreadCount(unread);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [adminId]);
  useEffect(() => {
    const handleReceiveNotification = (notify) => {
      if (notify.receiverId.includes(adminId)) {
        playNotifyTone();
        message.success("New notification received");
        setNotifications(prev => [notify, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    };

    socket.on("receiveNotification", handleReceiveNotification);
    return () => socket.off("receiveNotification", handleReceiveNotification);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await axios.put(`http://localhost:5000/api/read-all/${adminId}`);
      const updated = notifications.map(n => ({ ...n, readBy: true }));
      setNotifications(updated);
      setUnreadCount(0);
      message.success("All notifications marked as read");
    } catch (err) {
      console.error("Error marking notifications as read:", err);
      message.error("Failed to mark as read");
    }
  };

  const getFallbackEmoji = (gender) => {
    return gender === 'female' ? '👩' : '👨';
  };

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
        {unreadCount > 0 &&
          <Space>
            <Text type="secondary" style={{ cursor: 'pointer', fontSize: 12 }} onClick={handleMarkAllRead}>mark as read</Text>
          </Space>}
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
              gap: '12px',
              backgroundColor: notif.readBy ? '#fff' : '#e6f7ff',
              cursor: "pointer"
            }}
              onClick={() => navigate(notif.path)}
            >
              {
                notif.senderId?.profileUrl ? (
                  <Avatar size="large" src={notif.senderId.profileUrl} />
                ) : (
                  <Avatar size="large">
                    {getFallbackEmoji(notif.senderId?.gender)}
                  </Avatar>
                )
              }
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>
                  {notif.senderId?.role === 'teacher' ? 'Teacher' : 'System'}
                </div>
                <div style={{ color: '#888', fontSize: 12 }}>{notif.message}</div>
                <div style={{ color: '#aaa', fontSize: 11, marginTop: 4 }}>
                  {moment(notif.created_at).fromNow()}
                </div>
              </div>
              {/* <CloseOutlined style={{ fontSize: 12, color: '#888', cursor: 'pointer' }} /> */}
            </div>
          ))
        )}
      </div>

      {/* <div style={{
        padding: '12px 16px',
        textAlign: 'center',
        borderTop: '1px solid #f0f0f0',
        cursor: 'pointer'
      }}>
        <Text type="primary">Show all</Text>
      </div> */}
    </div>
  );
  return (
    <Dropdown
      dropdownRender={() => content}
      trigger={['click']}
      placement={placement}
    >
      <Badge count={unreadCount > 99 ? '99+' : unreadCount}  size="small">
        <BellTwoTone twoToneColor="#1890ff" style={{ fontSize: 22, cursor: 'pointer' }} />
      </Badge>
    </Dropdown>

  );
};

export default AdminNotify;
