import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  export const Charts = ({ monthlyData, lineData }) => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BarChartCard data={monthlyData} />
        <FeeStatusCard />
      </div>
    );
  };
  
  const BarChartCard = ({ data }) => (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Active Users</h3>
        <div className="text-sm text-gray-500">
          than last week <span className="text-green-500">+30%</span>
        </div>
      </div>
  
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#3B82F6" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
  
      <ChartFooter />
    </div>
  );
  
  const FeeStatusCard = () => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md p-6 sm:p-8 border border-gray-100">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          💰 Course Fee Status
        </h3>
        <p className="text-sm text-gray-500">
          Monitor your tuition payments at a glance
        </p>
      </div>
  
      <div className="space-y-5">
        <div>
          <p className="text-sm text-gray-500">Course</p>
          <p className="text-base font-medium text-indigo-600">
            Computer Science
          </p>
        </div>
  
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Fee</p>
            <p className="text-lg font-semibold text-gray-800">$2,500</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Paid</p>
            <p className="text-lg font-semibold text-green-600">
              $2,000 / $2,500
            </p>
          </div>
        </div>
  
        <div>
          <p className="text-sm text-gray-500">Remaining</p>
          <p className="text-lg font-semibold text-red-500">$500</p>
        </div>
  
        <div className="mt-2">
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
              style={{ width: `${(2000 / 2500) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            {((2000 / 2500) * 100).toFixed(0)}% Paid
          </p>
        </div>
      </div>
    </div>
  );
  
  const ChartFooter = () => (
    <div className="mt-6">
      <div className="mb-4">
        <div className="text-sm text-gray-500">
          We have created multiple options for you to put together and customise
          into pixel perfect pages.
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatItem value="3.6K" label="Users" />
        <StatItem value="2m" label="Clicks" />
        <StatItem value="$772" label="Sales" />
        <StatItem value="82" label="Items" />
      </div>
    </div>
  );
  
  const StatItem = ({ value, label }) => (
    <div>
      <div className="text-xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
  