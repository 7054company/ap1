import React from 'react';
import { Server, Database, Cloud, Globe } from 'lucide-react';

const Services: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ServiceCard
          title="Web Hosting"
          description="High-performance web hosting solutions"
          icon={<Globe className="h-8 w-8 text-blue-500" />}
          status="Active"
        />
        <ServiceCard
          title="Database"
          description="Scalable and secure database services"
          icon={<Database className="h-8 w-8 text-green-500" />}
          status="Active"
        />
        <ServiceCard
          title="Cloud Storage"
          description="Reliable and fast cloud storage options"
          icon={<Cloud className="h-8 w-8 text-purple-500" />}
          status="Active"
        />
        <ServiceCard
          title="Load Balancer"
          description="Efficient traffic distribution for high availability"
          icon={<Server className="h-8 w-8 text-yellow-500" />}
          status="Inactive"
        />
      </div>
    </div>
  );
};

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'Active' | 'Inactive';
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, status }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        {icon}
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
          status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
        Manage
      </button>
    </div>
  );
};

export default Services;