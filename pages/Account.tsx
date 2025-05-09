import React from 'react';
import { User, Mail, Phone, MapPin, Edit2 } from 'lucide-react';

const Account: React.FC = () => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Account Information</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center">
          <Edit2 size={16} className="mr-2" />
          Edit Profile
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AccountInfoItem icon={<User className="text-blue-500" />} label="Name" value="John Doe" />
        <AccountInfoItem icon={<Mail className="text-green-500" />} label="Email" value="john.doe@example.com" />
        <AccountInfoItem icon={<Phone className="text-yellow-500" />} label="Phone" value="+1 (555) 123-4567" />
        <AccountInfoItem icon={<MapPin className="text-red-500" />} label="Address" value="123 Main St, Anytown, USA" />
      </div>
    </div>
  );
};

interface AccountInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const AccountInfoItem: React.FC<AccountInfoItemProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
      <div className="mr-4">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default Account;