import React, { useState,useEffect } from 'react';
import {
  DashboardOutlined,
  UserAddOutlined,
  MenuOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Layout,
  Menu,
  theme,
  Drawer,
  Button,
  Grid,
  Dropdown,
  Avatar,
  Space,
  Typography
} from 'antd';
import { Link ,useLocation,useNavigate} from 'react-router-dom';
import TeacherChat from '../../Components/TeacherComponent/TeacherChat'
import TeacherNotify from './TeacherNotify'
const { Header, Content, Footer, Sider } = Layout;
const { useBreakpoint } = Grid;
const { Text } = Typography;

const menuItems = [
  {
    key: '1',
    icon: <DashboardOutlined />,
    label: <Link to="/teacher/dashboard">Dashboard</Link>,
  },
  {
    key: '2',
    icon: <UserAddOutlined />,
    label: <Link to="/teacher/class">Class</Link>,
  },
  {
    key: '3',
    icon: <TeamOutlined />,
    label: <Link to="/teacher/notification">All notification</Link>,
  },
  // {
  //   key: '4',
  //   icon: <GlobalOutlined />,
  //   label: <Link to="/admin/manage-class">Manage Class</Link>,
  // },
  // {
  //   key: '5',
  //   icon: <BankOutlined />,
  //   label: <Link to="/admin/manage-package">Manage Package</Link>,
  // },
  // {
  //   key: '6',
  //   icon: <EnvironmentOutlined />,
  //   label: <Link to="/admin/notification">Send Notification</Link>,
  // },
  // {
  //   key: '7',
  //   icon: <LogoutOutlined style={{ color: 'red' }} />,
  //   label: 'Logout',
  //   danger: true,
  // },
];





const profileMenu = {
  items: [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/teacher/profile">My Profile</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ],
};

const TeacherLayout = ({ children }) => {
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
            backgroundColor: '#EFEFEF',
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
              backgroundColor: '#EFEFEF',
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
              Taecher Panel
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
              backgroundColor: '#EFEFEF',
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
            background: '#EFEFEF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: 18 }}>Dashboard</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="lg:mr-60 md:mr-60">
           <TeacherNotify/>

            {!screens.xs ? (
              <Dropdown menu={profileMenu} trigger={['click']}>
                <Space style={{ cursor: 'pointer' }}>
                  <Avatar size="large" style={{ backgroundColor: '#87d068' }}>
                    T
                  </Avatar>
                  <span style={{ fontWeight: '500' }}>Taecher</span>
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
            <TeacherChat/>
          </div>
        </Content>

       
      </Layout>
    </Layout>
  );
};

export default TeacherLayout;
