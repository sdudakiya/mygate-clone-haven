import { ArrowLeft, UserPlus, Clock, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Visitors = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Visitors</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search visitors..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="flex items-center justify-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100">
            <UserPlus className="h-6 w-6 text-blue-600" />
            <span className="font-medium text-blue-600">Add Visitor</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100">
            <Clock className="h-6 w-6 text-purple-600" />
            <span className="font-medium text-purple-600">Pre-approve</span>
          </button>
        </div>

        {/* Recent Visitors */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Recent Visitors</h2>
          </div>
          <div className="divide-y">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                  <div>
                    <h3 className="font-medium">Visitor {i}</h3>
                    <p className="text-sm text-gray-500">Today, 2:30 PM</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Approved
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Visitors;