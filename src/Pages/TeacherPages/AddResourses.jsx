import React, { useState } from "react";
import { Modal, Input, Button, Card, Upload, message } from "antd";
import {
  PlusOutlined,
  DownloadOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const dummyResources = [
  {
    id: 1,
    title: "JavaScript Basics",
    fileName: "js-basics.pdf",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: 2,
    title: "React Guide",
    fileName: "react-guide.pdf",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
];

const AddResource = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resources, setResources] = useState(dummyResources);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    setTitle("");
    setFile(null);
  };

  const handleFileChange = (info) => {
    setFile(info.file.originFileObj);
  };

  const handleAdd = () => {
    if (!title.trim() || !file) {
      message.error("Please provide a title and upload a file.");
      return;
    }

    const newResource = {
      id: Date.now(),
      title,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
    };

    setResources([newResource, ...resources]);
    handleCancel();
    message.success("Resource added!");
  };

  const handleDelete = (id) => {
    setResources(resources.filter((res) => res.id !== id));
    message.success("Resource deleted!");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6 flex-col lg:flex-row ">
        <h2 className="text-3xl font-semibold text-blue-800 mb-5">📁 Resources</h2>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          className="bg-blue-600"
          onClick={showModal}
        >
          Add Resource
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {resources.map((res) => (
          <Card
            key={res.id}
            className="w-72 shadow-md border border-gray-200 hover:shadow-lg transition-all"
            title={res.title}
          >
            <p className="mb-4 text-gray-600 truncate">{res.fileName}</p>
            <div className="flex justify-between">
              <a href={res.fileUrl} download={res.fileName}>
                <Button icon={<DownloadOutlined />} type="primary">Download</Button>
              </a>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(res.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        title="Add New Resource"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleAdd}
        okText="Add"
      >
        <Input
          placeholder="Enter title"
          className="mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        /> <br /> <br />
        <center>
        <Upload
          beforeUpload={() => false}
          maxCount={1}
          onChange={handleFileChange}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
         </center>
      </Modal>
    </div>
  );
};

export default AddResource;
