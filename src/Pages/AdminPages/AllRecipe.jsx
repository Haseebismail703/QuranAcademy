import { useState, useEffect } from 'react';
import { Table, Button, message, Select, Space, Tag, Image } from 'antd';
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined, SyncOutlined, EyeOutlined } from '@ant-design/icons';
import axiosInstance from '../../Axios/axiosInstance';

const { Option } = Select;

const PackageTablePage = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch package data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/recipeLatest/681c8fdc6329587244535349/680c80cce7e608bd31fa9983');
        const data = response.data;
        console.log(data)
        // Ensure data is always treated as an array
        const formattedData = data.map((item)=>({
            ...item
        }));
        
        setAllData(formattedData);
        setFilteredData(formattedData.filter(item => item.status === 'pending'));
      } catch (error) {
        message.error(error.message || 'Failed to fetch package data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      // PUT API call to update status
      await axiosInstance.put(`/api/packages/${id}/status`, {
        status: newStatus
      });

      // Update both allData and filteredData
      setAllData(prevData => 
        prevData.map(item => 
          item._id === id ? { ...item, status: newStatus } : item
        )
      );

      setFilteredData(prevData => 
        prevData.filter(item => item._id !== id)
      );

      message.success('Status updated successfully');
    } catch (error) {
      message.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter data based on selected status
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    const filtered = allData.filter(item => item.status === status);
    setFilteredData(filtered);
  };

  // Status tag component
  const StatusTag = ({ status }) => {
    let color, icon;
    
    switch (status) {
      case 'pending':
        color = 'orange';
        icon = <SyncOutlined spin className="mb-1" />;
        break;
      case 'approved':
        color = 'green';
        icon = <CheckCircleOutlined  />;
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

  // Table columns
  const columns = [
    {
      title: 'Package Name',
      dataIndex: ['packageId', 'packageName'],
      key: 'packageName',
      render: (name) => <span className="font-medium">{name}</span>,
      width: 200,
    },
    {
      title: 'Course',
      dataIndex: ['courseId', 'courseName'],
      key: 'courseName',
      width: 150,
    },
    {
      title: 'Student',
      dataIndex: ['studentId', 'firstName'],
      key: 'studentName',
      width: 150,
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
            maskClassName: 'bg-white bg-opacity-50 rounded-full p-1'
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
      render: (status) => <StatusTag  status={status} />,
      width: 150,
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
      render: (_, record) => (
        <Space size="small">
          {record.status === 'pending' && (
            <>
              <Button 
                type="primary" 
                size="small"
                onClick={() => handleStatusUpdate(record._id, 'approved')}
                loading={updatingId === record._id}
              >
                Approve
              </Button>
              <Button 
                danger 
                size="small"
                onClick={() => handleStatusUpdate(record._id, 'rejected')}
                loading={updatingId === record._id}
              >
                Reject
              </Button>
            </>
          )}
          {record.status === 'approved' && (
            <Button 
                danger 
                size="small"
                onClick={() => handleStatusUpdate(record._id, 'rejected')}
                loading={updatingId === record._id}
              >
                Reject
              </Button>
          )}
          {record.status === 'rejected' && (
            <Button 
                type="primary" 
                size="small"
                onClick={() => handleStatusUpdate(record._id, 'approved')}
                loading={updatingId === record._id}
              >
                Approve
              </Button>
          )}
        </Space>
      ),
      align: 'right',
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-xl font-semibold text-gray-800">Package Submissions</h1>
            <div className="flex gap-3 flex-col md:flex-row">
              <Select 
                value={selectedStatus}
                style={{ width: 150 }} 
                onChange={handleStatusChange}
                className="min-w-[120px]"
              >
                <Option value="pending">Pending</Option>
                <Option value="approved">Approved</Option>
                <Option value="rejected">Rejected</Option>
              </Select>
              <Button 
                type="default" 
                onClick={() => window.location.reload()}
                className="flex items-center"
              >
                Refresh
              </Button>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="_id"
            loading={loading}
            scroll={{ x: 'max-content' }}
            className="custom-table"
            locale={{
              emptyText: `No ${selectedStatus} submissions found`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PackageTablePage;