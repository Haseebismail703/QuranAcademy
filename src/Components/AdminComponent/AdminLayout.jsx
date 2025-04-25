import React, { useState,useEffect } from 'react';
import {
  DashboardOutlined,
  UserAddOutlined,
  MenuOutlined,
  GlobalOutlined,
  LogoutOutlined,
  BankOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  BellTwoTone,
  UserOutlined,
  CloseOutlined
} from '@ant-design/icons';
import {
  Layout,
  Menu,
  theme,
  Drawer,
  Button,
  Grid,
  Badge,
  Dropdown,
  Avatar,
  Space,
  Typography
} from 'antd';
import { Link ,useLocation,useNavigate} from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const { useBreakpoint } = Grid;
const { Text } = Typography;

const menuItems = [
  {
    key: '1',
    icon: <DashboardOutlined />,
    label: <Link to="/admin/dashboard">Dashboard</Link>,
  },
  {
    key: '2',
    icon: <UserAddOutlined />,
    label: <Link to="/admin/manage-teachers">Manage Teachers</Link>,
  },
  {
    key: '3',
    icon: <TeamOutlined />,
    label: <Link to="/admin/manage-course">Manage Course</Link>,
  },
  {
    key: '4',
    icon: <GlobalOutlined />,
    label: <Link to="/admin/manage-class">Manage Class</Link>,
  },
  {
    key: '5',
    icon: <BankOutlined />,
    label: <Link to="/admin/manage-package">Manage Package</Link>,
  },
  {
    key: '6',
    icon: <EnvironmentOutlined />,
    label: <Link to="/admin/notification">Send Notification</Link>,
  },
  {
    key: '7',
    icon: <LogoutOutlined style={{ color: 'red' }} />,
    label: 'Logout',
    danger: true,
  },
];

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

const notificationContent = () => (
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

const profileMenu = {
  items: [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/admin/profile">My Profile</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ],
};

const AdminLayout = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const screens = useBreakpoint();
  const [visible, setVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const showDrawer = () => setVisible(true);
  const closeDrawer = () => setVisible(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const currentPath = location.pathname.split("/")[2];
    const matchedMenuItem = menuItems.find(item => item.label.props?.to.includes(currentPath));
    setSelectedKey(matchedMenuItem ? matchedMenuItem.key : "dashboard");
    document.body.style.backgroundColor = "#f4f6f8";
}, [location.pathname]);

  return (
    <Layout hasSider>
      {!screens.xs ? (
        <Sider
          width={240}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'sticky',
            top: 0,
            bottom: 0,
            backgroundColor: 'white',
            boxShadow: '4px 0 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              backgroundColor: 'white',
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
              alt="Logo"
              style={{ width: 40, height: 40 }}
            />
            <span
              style={{
                color: '#1DA57A',
                marginLeft: 10,
                fontSize: 18,
                fontWeight: 'bold',
              }}
            >
              Admin Panel
            </span>
          </div>
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[selectedKey]}
          onClick={(e) => setSelectedKey(e.key)}
            items={menuItems}
            style={{
              fontSize: '16px',
              backgroundColor: 'white',
              color: '#000',
              marginTop: 20,
            }}
          />
        </Sider>
      ) : (
        <Drawer title="Menu" placement="left" onClose={closeDrawer} open={visible} width={300}>
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={(e) => setSelectedKey(e.key)}
            items={menuItems}
          />
        </Drawer>
      )}

      <Layout>
        <Header
          style={{
            position: 'fixed',
            zIndex: 1000,
            width: '100%',
            padding: '0 24px',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: 18 }}>Dashboard</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="lg:mr-60 md:mr-60">
            <Dropdown dropdownRender={notificationContent} trigger={['click']} placement="bottomRight" arrow>
              <Badge count={notificationData.length} size="small">
                <BellTwoTone twoToneColor="#1890ff" style={{ fontSize: 22, cursor: 'pointer' }} />
              </Badge>
            </Dropdown>

            {!screens.xs ? (
              <Dropdown menu={profileMenu} trigger={['click']}>
                <Space style={{ cursor: 'pointer' }}>
                  <Avatar size="large" style={{ backgroundColor: '#87d068' }}>
                    A
                  </Avatar>
                  <span style={{ fontWeight: '500' }}>Admin</span>
                </Space>
              </Dropdown>
            ) : (
              <Button
                icon={<MenuOutlined />}
                type="text"
                onClick={showDrawer}
                style={{ fontSize: '20px' }}
              />
            )}
          </div>
        </Header>

        <Content style={{ margin: '80px 16px 0', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              minHeight: '80vh',
              boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
            }}
          >
            {children}
          </div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
