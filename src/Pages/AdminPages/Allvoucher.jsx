import { useState, useEffect } from 'react';
import { Table, Button, message, Select, Space, Tag, Image, Modal, Input } from 'antd';
import {
 SearchOutlined,
 ReloadOutlined,
 FileSearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  EyeOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import axiosInstance from '../../Axios/axiosInstance';

const { Option } = Select;
const { confirm } = Modal;

const PackageTablePage = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [updatingId, setUpdatingId] = useState(null);
  const [searchText, setSearchText] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/getLatestVoucher');
      const data = response.data;
      const formattedData = data.map((item) => ({
        ...item,
      }));
      setAllData(formattedData);
      setFilteredData(formattedData.filter((item) => item.status === 'pending'));
    } catch (error) {
      message.error(error.message || 'Failed to fetch package data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (data, newStatus) => {
    try {
      setUpdatingId(data._id);
      await axiosInstance.put(`/updateVoucherStatus`, {
        studentId: data.studentId?._id,
        courseId: data.courseId?._id,
        status: newStatus,
        voucherId: data?._id,
      });

      setAllData((prevData) =>
        prevData.map((item) =>
          item._id === data._id ? { ...item, status: newStatus } : item
        )
      );

      setFilteredData((prevData) => prevData.filter((item) => item._id !== data._id));

      message.success('Status updated successfully');
    } catch (error) {
      console.log(error);
      message.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const showRejectConfirm = (record) => {
    confirm({
      title: 'Are you sure you want to reject?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        handleStatusUpdate(record, 'rejected');
      },
    });
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    const filtered = allData.filter((item) => item.status === status);
    setFilteredData(filtered);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = allData.filter(
      (item) =>
        item?.studentId?.firstName?.toLowerCase().includes(value) ||
        item?.studentId?._id?.toLowerCase().includes(value) ||
        item?.courseId?.courseName?.toLowerCase().includes(value) ||
        item?.packageId?.packageName?.toLowerCase().includes(value)
    );
    setFilteredData(filtered.filter((item) => item.status === selectedStatus));
  };

  const StatusTag = ({ status }) => {
    let color, icon;
    switch (status) {
      case 'pending':
        color = 'orange';
        icon = <SyncOutlined />;
        break;
      case 'approved':
        color = 'green';
        icon = <CheckCircleOutlined />;
        break;
      case 'rejected':
        color = 'red';
        icon = <CloseCircleOutlined />;
        break;
      default:
        color = 'blue';
        icon = null;
    }

    return (
      <Tag icon={icon} color={color} className="capitalize">
        {status}
      </Tag>
    );
  };

  const studentNameFilters = [
    ...new Set(allData.map((item) => item?.studentId?.firstName).filter(Boolean)),
  ].map((name) => ({ text: name, value: name }));

  const studentIdFilters = [
    ...new Set(allData.map((item) => item?.studentId?._id).filter(Boolean)),
  ].map((id) => ({ text: id, value: id }));

  const columns = [
    {
      title: 'Package Name',
      dataIndex: ['packageId', 'packageName'],
      key: 'packageName',
      width: 200,
      render: (name) => <span className="font-medium">{name}</span>,
    },
    {
      title: 'Course',
      dataIndex: ['courseId', 'courseName'],
      key: 'courseName',
      width: 150,
    },
    {
      title: 'Student Name',
      dataIndex: ['studentId', 'firstName'],
      key: 'studentName',
      width: 150,
      filters: studentNameFilters,
      onFilter: (value, record) => record?.studentId?.firstName === value,
    },
    {
      title: 'Student ID',
      dataIndex: ['studentId', '_id'],
      key: 'studentId',
      width: 180,
      filters: studentIdFilters,
      onFilter: (value, record) => record?.studentId?._id === value,
    },
    {
      title: 'Image',
      key: 'image',
      render: (_, record) => (
        <Image
          width={50}
          src={record.recipeUrl}
          preview={{
            mask: <EyeOutlined />,
            maskClassName: 'bg-white bg-opacity-50 rounded-full p-1',
          }}
          className="rounded-md"
        />
      ),
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusTag status={status} />,
      width: 160,
    },
    {
      title: 'Submitted',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'pending' && (
            <>
              <button
                onClick={() => handleStatusUpdate(record, 'approved')}
                disabled={updatingId === record._id}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm cursor-pointer"
              >
                Confirm
              </button>
              <button
                onClick={() => showRejectConfirm(record)}
                disabled={updatingId === record._id}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm cursor-pointer"
              >
                Reject
              </button>
            </>
          )}
          {record.status === 'approved' && (
            <button
              onClick={() => showRejectConfirm(record)}
              disabled={updatingId === record._id}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm cursor-pointer"
            >
              Reject
            </button>
          )}
          {record.status === 'rejected' && (
            <button
              onClick={() => handleStatusUpdate(record, 'approved')}
              disabled={updatingId === record._id}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm cursor-pointer"
            >
              Confirm
            </button>
          )}
        </Space>
      ),
    },
  ];

 return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Fee Voucher</h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage and review all voucher
              </p>
            </div>
            
            {/* Controls Section */}
            <div className="flex gap-3 flex-col sm:flex-row w-full sm:w-auto">
              <Input
                placeholder="Search ..."
                value={searchText}
                onChange={handleSearch}
                className="w-full sm:w-48"
                prefix={<SearchOutlined className="text-gray-300" />}
                allowClear
              />
              
              <Select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="w-full sm:w-40"
              >
                <Option value="all">All Statuses</Option>
                <Option value="pending">
                  <Tag color="orange">Pending</Tag>
                </Option>
                <Option value="approved">
                  <Tag color="green">Approved</Tag>
                </Option>
                <Option value="rejected">
                  <Tag color="red">Rejected</Tag>
                </Option>
              </Select>
              
              <Button 
                type="default" 
                onClick={() => fetchData()}
                icon={<ReloadOutlined />}
                className="flex items-center justify-center"
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Table Section */}
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="_id"
              loading={loading}
              scroll={{ x: 'max-content' }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                showTotal: (total) => `Total ${total} items`
              }}
              className="custom-table"
              locale={{
                emptyText: (
                  <div className="py-12 text-center">
                    <FileSearchOutlined className="text-4xl text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">
                      No {selectedStatus !== 'all' ? selectedStatus : ''} submissions found
                    </h3>
                    <p className="text-gray-500 mt-1">
                      {selectedStatus === 'all' 
                        ? 'No submissions available' 
                        : `No ${selectedStatus} submissions at the moment`}
                    </p>
                  </div>
                )
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageTablePage;
