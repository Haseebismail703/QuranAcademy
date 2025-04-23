import React from 'react';
import { Card, Tag, Button } from 'antd';
import {
  DollarOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

const FeePaymentPage = () => {
  // Sample course packages data
  const packages = [
    {
      id: 1,
      name: 'Basic Package',
      course: 'Mathematics 101',
      price: 299,
      duration: '3 Months',
      endDate: '2023-12-31',
      isExpired: false
    },
    {
      id: 2,
      name: 'Standard Package',
      course: 'Computer Science 201',
      price: 499,
      duration: '6 Months',
      endDate: '2023-10-15',  // Past date (expired)
      isExpired: true
    },
    {
      id: 3,
      name: 'Premium Package',
      course: 'Physics 301',
      price: 799,
      duration: '12 Months',
      endDate: '2028-03-30',
      isExpired: false
    },
    {
      id: 4,
      name: 'Gold Package',
      course: 'Literature 150',
      price: 999,
      duration: '12 Months',
      endDate: '2023-09-01',  // Past date (expired)
      isExpired: true
    }
  ];

  // Color scheme
  const activeCardStyle = {
    borderTop: '4px solid #4f46e5', // Indigo-600
    background: 'linear-gradient(145deg, #ffffff, #f9fafb)'
  };

  const expiredCardStyle = {
    borderTop: '4px solid #e5e7eb', // Gray-200
    background: 'linear-gradient(145deg, #f9fafb, #f3f4f6)'
  };

  // Function to check if package is expired
  const checkExpired = (endDate) => {
    const today = new Date();
    const expiryDate = new Date(endDate);
    return expiryDate < today;
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          <DollarOutlined className="mr-2 text-indigo-600" /> Course Packages
        </h1>
        <p className="text-gray-600 mb-8">Choose your preferred learning package</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map(pkg => {
            const isExpired = checkExpired(pkg.endDate);
            
            return (
              <div key={pkg.id} className="relative transform hover:scale-[1.02] transition-all duration-200">
                {/* Expired overlay */}
                {isExpired && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 z-10 rounded-lg flex items-center justify-center">
                    <Tag color="green" className="rounded-full px-4 py-1 text-sm font-medium">
                      <CloseCircleOutlined className="mr-1" /> Paid
                    </Tag>
                  </div>
                )}
                
                <Card
                  className={`shadow-lg h-full transition-all ${isExpired ? 'opacity-90' : 'hover:shadow-xl'}`}
                  bodyStyle={{ padding: '24px' }}
                  styles={{ body: { padding: '24px' } }}
                  hoverable={!isExpired}
                  
                >
                  <div className="flex flex-col h-full">
                    <div className="mb-6">
                      <Tag color={isExpired ? "gray" : "indigo"} className="mb-3 rounded-full px-3 py-1">
                        {pkg.duration}
                      </Tag>
                      <h3 className={`text-xl font-bold ${isExpired ? 'text-gray-500' : 'text-gray-800'}`}>
                        {pkg.name}
                      </h3>
                      <p className={`text-sm ${isExpired ? 'text-gray-400' : 'text-gray-600'}`}>
                        {pkg.course}
                      </p>
                    </div>
                    
                    <div className="mb-6 space-y-4">
                      <div>
                        <p className={`text-xs font-medium ${isExpired ? 'text-gray-400' : 'text-gray-500'}`}>
                          PRICE
                        </p>
                        <p className={`text-3xl font-bold ${isExpired ? 'text-gray-400' : 'text-indigo-600'}`}>
                          ${pkg.price}
                        </p>
                      </div>
                      
                      <div className="flex items-center">
                        <CalendarOutlined className={`mr-2 ${isExpired ? 'text-gray-400' : 'text-indigo-500'}`} />
                        <span className={isExpired ? 'text-gray-400' : 'text-gray-600'}>
                          Ends: {pkg.endDate}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      type={isExpired ? "default" : "primary"}
                      block
                      size="large"
                      className={`mt-auto ${isExpired ? 'bg-gray-100 text-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                      disabled={isExpired}
                      icon={!isExpired ? <CheckCircleOutlined /> : null}
                    >
                      {isExpired ? 'Paid' : 'Pay now'}
                    </Button>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeePaymentPage;