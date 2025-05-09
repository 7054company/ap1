import React, { useState } from 'react';
import {
  Search,
  Users,
  CreditCard,
  FileText,
  Shield,
  Database,
  Terminal,
  AlertCircle,
} from 'lucide-react';
import TeamSettings from '../components/settings/TeamSettings';
import GeneralSettings from '../components/settings/GeneralSettings';
import SecuritySettings from '../components/settings/SecuritySettings';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('team');
  const [searchQuery, setSearchQuery] = useState('');

  const renderContent = () => {
    switch (activeSection) {
      case 'team':
        return <TeamSettings />;
      case 'general':
        return <GeneralSettings />;
      case 'security':
        return <SecuritySettings />;
      default:
        return (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              Section Under Development
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              This section is currently being worked on.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gradient-to-br from-white to-gray-100">
      {/* Sidebar */}
      {/* Sidebar to-grey-200 data */}
      <div className="w-72 border-r border-gray-200 bg-gradient-to-b from-white to-white-200 text-gray-800 shadow-lg">
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search settings..."
              className="w-full rounded-md border border-gray-300 bg-gray-50 pl-10 pr-4 py-2 text-sm focus:border-indigo-400 focus:ring-0 text-gray-700 placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <nav className="space-y-2 px-4">
          <SidebarItem
            icon={<Users className="h-5 w-5" />}
            text="Team"
            active={activeSection === 'team'}
            onClick={() => setActiveSection('team')}
          />
          <SidebarItem
            icon={<Terminal className="h-5 w-5" />}
            text="General"
            active={activeSection === 'general'}
            onClick={() => setActiveSection('general')}
          />
          <SidebarItem
            icon={<Shield className="h-5 w-5" />}
            text="Security & Privacy"
            active={activeSection === 'security'}
            onClick={() => setActiveSection('security')}
          />
          <SidebarItem
            icon={<CreditCard className="h-5 w-5" />}
            text="Billing"
            active={activeSection === 'billing'}
            onClick={() => setActiveSection('billing')}
          />
          <SidebarItem
            icon={<FileText className="h-5 w-5" />}
            text="Invoices"
            active={activeSection === 'invoices'}
            onClick={() => setActiveSection('invoices')}
          />
          <SidebarItem
            icon={<Database className="h-5 w-5" />}
            text="Log Drains"
            active={activeSection === 'logs'}
            onClick={() => setActiveSection('logs')}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto py-10 px-6">
          {/*       <div className="bg-white rounded-xl shadow-lg p-8 transition-all hover:shadow-xl">
            {renderContent()}
  </div>   */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  active,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm rounded-lg transition duration-150 ease-in-out ${
        active
          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md'
          : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900 hover:shadow-md'
      }`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default Settings;
