import { Bell, Home, Users, FileText, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">MyGate</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/visitors"
                className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100"
              >
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Visitors</span>
              </Link>
              <Link
                to="/notices"
                className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100"
              >
                <FileText className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-sm font-medium">Notices</span>
              </Link>
              <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100">
                <Home className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium">Society</span>
              </button>
              <Link
                to="/settings"
                className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100"
              >
                <Settings className="h-8 w-8 text-orange-600 mb-2" />
                <span className="text-sm font-medium">Settings</span>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">New Visitor</p>
                  <p className="text-xs text-gray-500">
                    John Doe arrived at 2:30 PM
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">New Notice</p>
                  <p className="text-xs text-gray-500">
                    Monthly society meeting scheduled
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Community Updates */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Community Updates</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium">Maintenance Schedule</p>
                <p className="text-xs text-gray-500 mt-1">
                  Water supply maintenance on Sunday, 10 AM - 2 PM
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium">New Amenity</p>
                <p className="text-xs text-gray-500 mt-1">
                  New gym equipment installed in the community center
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-3">
            <Link to="/" className="flex flex-col items-center text-blue-600">
              <Home className="h-6 w-6" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link
              to="/visitors"
              className="flex flex-col items-center text-gray-600"
            >
              <Users className="h-6 w-6" />
              <span className="text-xs mt-1">Visitors</span>
            </Link>
            <Link
              to="/notices"
              className="flex flex-col items-center text-gray-600"
            >
              <FileText className="h-6 w-6" />
              <span className="text-xs mt-1">Notices</span>
            </Link>
            <Link
              to="/settings"
              className="flex flex-col items-center text-gray-600"
            >
              <Settings className="h-6 w-6" />
              <span className="text-xs mt-1">More</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Index;