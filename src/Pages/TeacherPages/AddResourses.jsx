import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  message,
  Spin,
  Empty,
  Modal,
  Form,
  Input,
  Select,
  Upload,
} from "antd";
import {
  DownloadOutlined,
  DeleteOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileZipOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../Axios/axiosInstance";
import { useParams } from "react-router-dom";

const AddResource = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  const { classId } = useParams();

  const getResources = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/getFilesByClassId/${classId}`);
      setResources(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/deleteFile/${id}`);
      setResources((prev) => prev.filter((item) => item._id !== id));
      message.success("Resource deleted successfully!");
    } catch (err) {
      console.error(err);
      message.error("Failed to delete resource");
    }
  };

  const getFileIcon = (type) => {
    const typeLower = type?.toLowerCase();
    if (typeLower?.includes("pdf")) return <FilePdfOutlined className="text-red-500" />;
    if (typeLower?.includes("image")) return <FileImageOutlined className="text-green-500" />;
    if (typeLower?.includes("word")) return <FileWordOutlined className="text-blue-500" />;
    if (typeLower?.includes("excel") || typeLower?.includes("sheet"))
      return <FileExcelOutlined className="text-green-600" />;
    if (typeLower?.includes("zip") || typeLower?.includes("compressed"))
      return <FileZipOutlined className="text-yellow-500" />;
    return <FileOutlined className="text-gray-500" />;
  };

  const handleUpload = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("type", values.type);
      formData.append("classId", classId);

      const file = values.file?.[0]?.originFileObj;
      if (!file) {
        message.error("Please select a file.");
        return;
      }

      formData.append("file", file);

      setUploading(true);
      await axiosInstance.post("/addFile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("Resource uploaded successfully");
      form.resetFields();
      setIsModalOpen(false);
      getResources();
    } catch (error) {
      console.error(error);
      message.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };



  useEffect(() => {
    getResources();
  }, [classId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading resources..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">
            📁 Class Resources
          </h2>
          <p className="text-gray-600">Manage and access all your course materials</p>
        </div>

        <div className="text-right mb-4">
          <Button
            icon={<PlusOutlined />}
            type="primary"
            className="bg-blue-600 hover:bg-blue-700 border-blue-600"
            onClick={() => setIsModalOpen(true)}
          >
            Upload Resource
          </Button>
        </div>

        {resources.length > 0 ? (
          <>
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-blue-100">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                {resources[0].classId?.courseId?.courseName || "Course Resources"}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                <span className="flex items-center">
                  <ClockCircleOutlined className="mr-1 text-blue-500" />
                  {resources[0].classId?.classTiming || "Not specified"}
                </span>
                <span className="flex items-center">
                  <UserOutlined className="mr-1 text-blue-500" />
                  {"Teacher"}
                </span>
                <span className="flex items-center">
                  <FileOutlined className="mr-1 text-blue-500" />
                  {resources.length} resource{resources.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((res) => (
                <Card
                  key={res._id}
                  className="border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:border-blue-200"
                  hoverable
                >
                  <div className="flex items-start mb-4">
                    <div className="text-3xl mr-4">{getFileIcon(res.type)}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {res.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {res.type} • {new Date(res.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <a href={res.url} download className="flex-1 mr-2">
                      <Button
                        icon={<DownloadOutlined />}
                        type="primary"
                        className="w-full bg-blue-600 hover:bg-blue-700 border-blue-600"
                      >
                        Download
                      </Button>
                    </a>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(res._id)}
                      className="flex-1 ml-2"
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm">
            <Empty
              image={<FileOutlined className="text-5xl text-gray-400" />}
              description={
                <span className="text-gray-600">No resources found for this class</span>
              }
            />
            <Button
              type="primary"
              className="mt-4 bg-blue-600 hover:bg-blue-700 border-blue-600"
              onClick={getResources}
            >
              Refresh
            </Button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        title="Upload Resource"
        open={isModalOpen}
        onOk={handleUpload}
        confirmLoading={uploading}
        onCancel={() => setIsModalOpen(false)}
        okText="Upload"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input placeholder="Enter file title" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Select file type" }]}
          >
            <Select placeholder="Select type">
              <Select.Option value="pdf">PDF</Select.Option>
              <Select.Option value="image">Image</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="file"
            label="File"
            valuePropName="file"
            getValueFromEvent={(e) => e.fileList}
            rules={[{ required: true, message: "Please upload a file" }]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>

              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddResource;
