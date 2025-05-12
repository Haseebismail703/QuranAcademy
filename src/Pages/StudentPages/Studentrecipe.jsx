import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Upload,
  message,
  Card,
  Progress,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../Axios/axiosInstance";

export default function PackageRecipe() {
  const [data, setData] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(
        "/generate-recipe/681c8fdc6329587244535349/680c80cce7e608bd31fa9983/6821a56262f5812015504e11"
      )
      .then((res) => setData(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) return <div className="text-center mt-10">Loading...</div>;

  const { packageDetails, allRecipes } = data;
  const daysRemaining = Math.ceil(
    (new Date(packageDetails.monthEnd) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const StatusTag = ({ status }) => {
    let color, icon;

    switch (status) {
      case "pending":
        color = "orange";
        icon = <SyncOutlined spin />;
        break;
      case "approved":
        color = "green";
        icon = <CheckCircleOutlined />;
        break;
      case "rejected":
        color = "red";
        icon = <CloseCircleOutlined />;
        break;
      default:
        color = "blue";
    }

    return (
      <Tag icon={icon} color={color} className="capitalize">
        {status}
      </Tag>
    );
  };

  const handleUpload = (recipeId) => {
    if (!fileList.length) {
      message.warning("Please select a file first");
      return;
    }

    setUploading(true);
    setTimeout(() => {
      message.success("File uploaded successfully");
      setUploading(false);
      setFileList([]);
      setEditingRecipeId(null);
    }, 1500);
  };

  const columns = [
    {
      title: "#",
      key: "index",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <StatusTag status={status} />,
      width: 120,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
      width: 120,
    },
    {
      title: "Recipe File",
      key: "file",
      render: (_, record) =>
        record.recipeUrl ? (
          <a
            href={record.recipeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View File
          </a>
        ) : (
          <span className="text-gray-400">No file</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const isAddDisabled = record.status === "approved" || record.recipeUrl;
        const isEditDisabled =
          record.status === "approved" ||
          (record.status === "rejected" && !record.recipeUrl);

        return (
          <div className="flex gap-2">
            <Upload
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              showUploadList={false}
              disabled={isAddDisabled}
            >
              <Button
                size="small"
                icon={<UploadOutlined />}
                disabled={isAddDisabled}
                onClick={() => setEditingRecipeId(record._id)}
              >
                Add
              </Button>
            </Upload>

            <Button
              size="small"
              icon={<EditOutlined />}
              disabled={isEditDisabled}
              onClick={() => {
                setEditingRecipeId(record._id);
                setFileList([]);
              }}
            >
              Edit
            </Button>

            {editingRecipeId === record._id && (
              <Button
                type="primary"
                size="small"
                loading={uploading}
                onClick={() => handleUpload(record._id)}
                className="bg-green-600 hover:bg-green-700"
              >
                Upload
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Package Card */}
        <Card
          className="shadow-md border-0 mb-6 bg-gradient-to-r from-blue-100 to-indigo-100"
          title={<span className="text-xl font-semibold text-gray-800">{packageDetails.packageName}</span>}
          extra={
            <Tag color={data.isMonthEnd ? "green" : "blue"}>
              {data.isMonthEnd ? "MONTH END" : "REGULAR CHECK"}
            </Tag>
          }
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-gray-700 mb-1">
                <b>Course:</b> Nazra
              </p>
              <p className="text-gray-700 mb-1">
                <b>Student:</b> Haseeb
              </p>
              <p className="text-gray-700 mb-1">
                <b>Month End:</b>{" "}
                {new Date(packageDetails.monthEnd).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-2">
                <b>Days Remaining:</b>{" "}
                <span
                  className={`font-semibold ${
                    daysRemaining <= 7 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {daysRemaining} days
                </span>
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Progress
                type="circle"
                percent={Math.max(
                  0,
                  Math.min(100, 100 - (daysRemaining / 30) * 100)
                )}
                width={80}
                strokeColor={daysRemaining <= 7 ? "#f5222d" : "#52c41a"}
              />
              <Button
                type="primary"
                size="middle"
                className="mt-3 bg-blue-600 hover:bg-blue-700"
              >
                Make Payment
              </Button>
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card className="shadow-md border-0" title="Recipe Submissions">
          <Table
            columns={columns}
            dataSource={allRecipes}
            rowKey="_id"
            pagination={false}
            locale={{ emptyText: "No recipe submissions yet." }}
          />
        </Card>

        {/* File Upload Section */}
        {editingRecipeId && (
          <div className="mt-6 p-4 bg-white border rounded-lg shadow-sm">
            <h3 className="mb-2 font-medium text-gray-800">
              {fileList.length ? "Selected File:" : "Select File to Upload"}
            </h3>
            <Upload
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </div>
        )}
      </div>
    </div>
  );
}
