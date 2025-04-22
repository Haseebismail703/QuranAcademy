import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Card, message } from 'antd';
import { NotificationOutlined, UserOutlined, TeamOutlined, MailOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const SendNotification = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Exam Schedule',
      message: 'Final exams will begin next Monday',
      recipients: 'All Students',
      date: '2023-05-15',
    },
    {
      id: '2',
      title: 'Staff Meeting',
      message: 'Monthly staff meeting tomorrow at 10 AM',
      recipients: 'All Teachers',
      date: '2023-05-10',
    },
    {
      id: '3',
      title: 'Holiday Announcement',
      message: 'School will be closed for Eid holidays',
      recipients: 'All Teachers & Students',
      date: '2023-05-05',
    }
  ]);

  const recipientOptions = [
    { value: 'all', label: 'All Teachers & Students' },
    { value: 'teachers', label: 'All Teachers' },
    { value: 'students', label: 'All Students' },
    { value: 'custom', label: 'Custom Selection' }
  ];

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const newNotification = {
        id: (notifications.length + 1).toString(),
        title: values.title,
        message: values.message,
        recipients: recipientOptions.find(r => r.value === values.recipients)?.label || values.recipients,
        date: new Date().toISOString().split('T')[0],
      };
      setNotifications([...notifications, newNotification]);
      message.success('Notification sent successfully!');
      setIsModalVisible(false);
    });
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      render: (text) => <div className="text-gray-600 line-clamp-1">{text}</div>,
    },
    {
      title: 'Recipients',
      dataIndex: 'recipients',
      key: 'recipients',
      render: (recipients) => {
        let color = 'blue';
        if (recipients.includes('Teachers')) color = 'purple';
        if (recipients.includes('Students')) color = 'green';
        if (recipients.includes('&')) color = 'orange';
        
        return (
          <Tag color={color} className="capitalize">
            {recipients.includes('All') ? recipients : `To: ${recipients}`}
          </Tag>
        );
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => <span className="text-gray-500">{date}</span>,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row gap-4  justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notification Center</h1>
          <p className="text-gray-500">Send and manage notifications to teachers and students</p>
        </div>
        <Button
          type="primary"
          icon={<NotificationOutlined />}
          onClick={showModal}
          className="bg-blue-600 hover:bg-blue-700"
          size="large"
        >
          Send Notification
        </Button>
      </div>

      <Card className="rounded-xl shadow-sm border-0 overflow-hidden">
        <Table
          columns={columns}
          dataSource={notifications}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          className="custom-antd-table"
        />
      </Card>

      {/* Notification Modal */}
      <Modal
        title="Send New Notification"
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText="Send Notification"
        cancelText="Cancel"
        width={700}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="title"
            label="Notification Title"
            rules={[{ required: true, message: 'Please enter notification title' }]}
          >
            <Input 
              prefix={<MailOutlined className="text-gray-400" />} 
              placeholder="Enter notification title" 
            />
          </Form.Item>

          <Form.Item
            name="recipients"
            label="Recipients"
            rules={[{ required: true, message: 'Please select recipients' }]}
          >
            <Select placeholder="Select recipients">
              {recipientOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  <div className="flex items-center">
                    {option.value === 'teachers' && <UserOutlined className="mr-2 text-purple-500" />}
                    {option.value === 'students' && <TeamOutlined className="mr-2 text-green-500" />}
                    {option.value === 'all' && (
                      <>
                        <UserOutlined className="mr-1 text-purple-500" />
                        <TeamOutlined className="mr-2 text-green-500" />
                      </>
                    )}
                    {option.label}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="message"
            label="Message"
            rules={[{ required: true, message: 'Please enter notification message' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter your notification message here..." 
              showCount 
              maxLength={500}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Custom Table Styles */}
      <style >{`
        .custom-antd-table .ant-table-thead > tr > th {
          background-color: #f8fafc !important;
          color: #64748b !important;
          font-weight: 600 !important;
          border-bottom: 1px solid #e2e8f0 !important;
        }
        .custom-antd-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f1f5f9 !important;
        }
        .custom-antd-table .ant-table-pagination.ant-pagination {
          margin: 16px 0 !important;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default SendNotification;