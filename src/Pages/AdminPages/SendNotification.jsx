import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Table,
  Popconfirm,
} from "antd";
import axiosInstance from '../../Axios/axiosInstance.js'

const { Option } = Select;
const { TextArea } = Input;

const NotificationPage = () => {
  const [form] = Form.useForm();
  const [notifications, setNotifications] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loader,setLoader] = useState(false)
  // Fetch notifications
  const fetchNotifications = async () => {
    setLoader(true)
    try {
      const response = await axiosInstance.get("/getAllNotification");
      const data = response.data.map((item,index) => ({
        ...item,index 
      }));
      // console.log(data);
      setLoader(false)
      setNotifications(data);
    } catch (err) {
      message.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Create notification
  const handleCreate = async (values) => {
    try {
      await axiosInstance.post("/creatNoti", {
        ...values,
        expiryDate: values.expiryDate.toISOString(),
      });
      message.success("Notification sent");
      setCreateModalVisible(false);
      form.resetFields();
      fetchNotifications();
    } catch {
      message.error("Failed to send notification");
    }
  };

  // Delete notification
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/deleteNoti/${id}`);
      message.success("Notification deleted");
      fetchNotifications();
    } catch {
      message.error("Delete failed");
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")} ${d.toLocaleString("default", {
      month: "short",
    })} ${d.getFullYear()}, ${d.getHours().toString().padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${d.getHours() >= 12 ? "PM" : "AM"}`;
  };

  const columns = [
    {
      title : "No",
      dataIndex : "index",
      render : (index) => <p>{index + 1}</p>
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "For",
      dataIndex: "forRole",
      render: (role) => role.charAt(0).toUpperCase() + role.slice(1),
    },
    {
      title: "Expires",
      dataIndex: "expiryDate",
      render: (date) => formatDate(date),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setSelectedNotification(record);
              setViewModalVisible(true);
            }}
            type="primary"
          >
            View
          </Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="primary">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6  min-h-screen">
      <div className="flex justify-between items-center mb-5 md:flex-row flex-col ">
        <h1 className="text-2xl font-bold">All Notifications</h1>
        <Button  type="primary" onClick={() => setCreateModalVisible(true)}>
          Send Notification
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={notifications}
        rowKey="_id"
        bordered
        className="bg-white shadow-md"
        scroll={{"x" : "100%"}}
        loading={loader}
      />

      {/* Create Notification Modal */}
      <Modal
        title="Create Notification"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={() => form.submit()}
        okText="Send"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Enter title" />
          </Form.Item>
          <Form.Item name="message" label="Message" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Enter message" />
          </Form.Item>
          <Form.Item name="forRole" label="Send To" initialValue="all">
            <Select>
              <Option value="all">All</Option>
              <Option value="students">Students Only</Option>
              <Option value="teachers">Teachers Only</Option>
            </Select>
          </Form.Item>
          <Form.Item name="expiryDate" label="Expiry Date" rules={[{ required: true }]}>
            <DatePicker showTime className="w-full" />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Notification Modal */}
      <Modal
        title="Notification Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
      >
        {selectedNotification && (
          <div className="space-y-2">
            <p>
              <strong>Title:</strong> {selectedNotification.title}
            </p>
            <p>
              <strong>Message:</strong> {selectedNotification.message}
            </p>
            <p>
              <strong>For:</strong> {selectedNotification.forRole}
            </p>
            <p>
              <strong>Expires:</strong> {formatDate(selectedNotification.expiryDate)}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NotificationPage;
