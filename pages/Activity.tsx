import React from 'react';
import { Activity as ActivityIcon, User, Server, Settings, AlertTriangle } from 'lucide-react';

const Activity: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Recent Activity</h1>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Activity Log</h2>
        </div>
        <ul className="divide-y divide-gray-200">
          <ActivityItem
            icon={<User className="h-5 w-5 text-blue-500" />}
            title="New user registered"
            description="john.doe@example.com"
            time="2 hours ago"
          />
          <ActivityItem
            icon={<Server className="h-5 w-5 text-green-500" />}
            title="Service deployed"
            description="Web Hosting service deployed successfully"
            time="4 hours ago"
          />
          <ActivityItem
            icon={<Settings className="h-5 w-5 text-yellow-500" />}
            title="Settings updated"
            description="Security settings modified"
            time="Yesterday"
          />
          <ActivityItem
            icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
            title="Alert triggered"
            description="High CPU usage detected on Database server"
            time="2 days ago"
          />
        </ul>
      </div>
    </div>
  );
};

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, title, description, time }) => {
  return (
    <li className="px-4 py-3 sm:px-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="ml-auto">
          <p className="text-sm text-gray-500">{time}</p>
        </div>
      </div>
    </li>
  );
};

export default Activity;