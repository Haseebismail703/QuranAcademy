import { DollarSign, Users, Heart, ShoppingBag } from "lucide-react";

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
      <StatsCard
        title="Today's Sales"
        value="$53,000"
        change={30}
        icon={<DollarSign className="h-6 w-6 text-white" />}
        iconBg="bg-blue-500"
      />
      <StatsCard
        title="Today's Users"
        value="3,200"
        change={20}
        icon={<Users className="h-6 w-6 text-white" />}
        iconBg="bg-blue-500"
      />
      <StatsCard
        title="New Clients"
        value="+1,200"
        change={-20}
        icon={<Heart className="h-6 w-6 text-white" />}
        iconBg="bg-blue-500"
      />
      <StatsCard
        title="New Orders"
        value="$13,200"
        change={10}
        icon={<ShoppingBag className="h-6 w-6 text-white" />}
        iconBg="bg-blue-500"
      />
    </div>
  );
};

const StatsCard = ({ title, value, change, icon, iconBg }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center">
      <div className={`p-3 rounded-full ${iconBg} mr-4`}>{icon}</div>
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-lg font-semibold text-gray-800">{value}</div>
        <div className={`text-sm ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
          {change >= 0 ? "+" : ""}
          {change}%
        </div>
      </div>
    </div>
  );
};