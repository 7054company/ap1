import React from 'react';
import { Server, Activity, Clock, Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Active Services"
          value="12"
          icon={<Server className="h-8 w-8 text-blue-500" />}
        />
        <DashboardCard
          title="Recent Activities"
          value="28"
          icon={<Activity className="h-8 w-8 text-green-500" />}
        />
        <DashboardCard
          title="Uptime"
          value="99.9%"
          icon={<Clock className="h-8 w-8 text-purple-500" />}
        />
        <DashboardCard
          title="API Requests"
          value="1.2M"
          icon={<Zap className="h-8 w-8 text-yellow-500" />}
        />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard title="Deploy New Service" description="Launch a new service instance" />
          <QuickActionCard title="View Logs" description="Check system and application logs" />
          <QuickActionCard title="Manage Users" description="Add or remove user access" />
        </div>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

interface QuickActionCardProps {
  title: string;
  description: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md cursor-pointer">
      <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default Dashboard;