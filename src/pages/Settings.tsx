import { ArrowLeft, User, Bell, Shield, HelpCircle, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gray-200" />
            <div>
              <h2 className="text-xl font-semibold">John Doe</h2>
              <p className="text-gray-500">Flat 101, Block A</p>
            </div>
          </div>
        </div>

        {/* Settings Options */}
        <div className="bg-white rounded-lg shadow">
          <div className="divide-y">
            <button className="w-full p-4 flex items-center space-x-4 hover:bg-gray-50">
              <User className="h-6 w-6 text-gray-600" />
              <span className="flex-1 text-left">Profile Settings</span>
            </button>
            <button className="w-full p-4 flex items-center space-x-4 hover:bg-gray-50">
              <Bell className="h-6 w-6 text-gray-600" />
              <span className="flex-1 text-left">Notifications</span>
            </button>
            <button className="w-full p-4 flex items-center space-x-4 hover:bg-gray-50">
              <Shield className="h-6 w-6 text-gray-600" />
              <span className="flex-1 text-left">Privacy & Security</span>
            </button>
            <button className="w-full p-4 flex items-center space-x-4 hover:bg-gray-50">
              <HelpCircle className="h-6 w-6 text-gray-600" />
              <span className="flex-1 text-left">Help & Support</span>
            </button>
            <button className="w-full p-4 flex items-center space-x-4 text-red-600 hover:bg-gray-50">
              <LogOut className="h-6 w-6" />
              <span className="flex-1 text-left">Logout</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;