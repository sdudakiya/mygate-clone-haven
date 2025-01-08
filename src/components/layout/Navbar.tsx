import { Bell, Home, Users, FileText, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { profile } = useAuth();

  return (
    <>
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-3">
            <Link
              to="/"
              className={`flex flex-col items-center ${
                location.pathname === "/" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <Home className="h-6 w-6" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link
              to="/visitors"
              className={`flex flex-col items-center ${
                location.pathname === "/visitors"
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
            >
              <Users className="h-6 w-6" />
              <span className="text-xs mt-1">Visitors</span>
            </Link>
            <Link
              to="/notices"
              className={`flex flex-col items-center ${
                location.pathname === "/notices"
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
            >
              <FileText className="h-6 w-6" />
              <span className="text-xs mt-1">Notices</span>
            </Link>
            <Link
              to="/settings"
              className={`flex flex-col items-center ${
                location.pathname === "/settings"
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
            >
              <Settings className="h-6 w-6" />
              <span className="text-xs mt-1">More</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;