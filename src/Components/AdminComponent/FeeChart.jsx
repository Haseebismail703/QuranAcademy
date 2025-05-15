import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Spin, Typography } from "antd";
import axiosInstance from '../../Axios/axiosInstance.js'

const { Title } = Typography;

const FeeChart = () => {
  const [loading, setLoading] = useState(true);
  const [feeData, setFeeData] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axiosInstance.get("/getMonthlyApprovedFee");
      const data = res.data;
      setFeeData(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch fee data:", err);
    }
  };

  fetchData();
}, []);


  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <Title level={4} className="text-center mb-4">Monthly Paid Fee (Last 12 Months)</Title>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={feeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default FeeChart;
