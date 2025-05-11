import React, { useEffect, useState } from "react";
import { Button, Modal, Input, DatePicker, Table, message, Popconfirm, Form } from "antd";
import moment from "moment";
import { useParams } from "react-router-dom";
import axiosInstance from './../../Axios/axiosInstance';

const { TextArea } = Input;

const ClassNotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", message: "", expiryDate: "" });
  const [selectedMessage, setSelectedMessage] = useState("");
  const { classId } = useParams();

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get(`/getAllClassNotification`);
      let getNoti = res.data.map((item,index)=>({
        ...item
      }))
      console.log(res.data)
      setNotifications(getNoti);
    } catch (error) {
      message.error("Error fetching notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [classId]);

  const handleCreate = async () => {
    const { title, message: msg, expiryDate } = formData;
    if (!title || !msg || !expiryDate) {
      return message.warning("Please fill all fields");
    }

    try {
      await axiosInstance.post("/createClassNotification", {
        ...formData,
        classId,
      });
      message.success("Notification Created");
      setOpen(false);
      setFormData({ title: "", message: "", expiryDate: "" });
      fetchNotifications();
    } catch (error) {
      message.error("Error creating notification");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/classNotification/${id}`);
      message.success("Notification deleted");
      fetchNotifications();
    } catch (error) {
      message.error("Error deleting notification");
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      className: "font-semibold",
    },
    {
      title: "Expiry",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="link"
            onClick={() => {
              setSelectedMessage(record.message);
              setViewModal(true);
            }}
          >
            View
          </Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger type="link">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Class Notifications</h2>
        <Button type="primary" onClick={() => setOpen(true)}>
          + Add Notification
        </Button>
      </div>

      <Table
        dataSource={notifications}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      {/* Create Modal */}
        <Modal
          title="Create Notification"
          open={open}
          onCancel={() => setOpen(false)}
          onOk={handleCreate}
          okText="Create"
        >
          <Form layout="vertical">
            <Form.Item label="Title" required>
          <Input
            placeholder="Enter Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
            </Form.Item>
            <Form.Item label="Message" required>
          <TextArea
            placeholder="Enter Message"
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
            </Form.Item>
            <Form.Item label="Expiry Date & Time" required>
          <DatePicker
            className="w-full"
            placeholder="Select Expiry Date & Time"
            showTime
            disabledDate={(current) => current && current < moment().startOf('day')}
            onChange={(date) =>
              setFormData({ ...formData, expiryDate: date?.toISOString() })
            }
          />
            </Form.Item>
          </Form>
        </Modal>

        {/* View Message Modal */}
      <Modal
        title="Notification Message"
        open={viewModal}
        onCancel={() => setViewModal(false)}
        footer={null}
      >
        <p>{selectedMessage}</p>
      </Modal>
    </div>
  );
};

export default ClassNotificationPage;
