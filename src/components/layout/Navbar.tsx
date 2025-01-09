import { Bell, Home, Users, FileText, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { profile } = useAuth();

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600">MyGate</h1>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100">
                <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-around py-2 sm:py-3">
            <Link
              to="/"
              className={`flex flex-col items-center px-2 ${
                location.pathname === "/" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <Home className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs mt-0.5 sm:mt-1">Home</span>
            </Link>
            <Link
              to="/visitors"
              className={`flex flex-col items-center px-2 ${
                location.pathname === "/visitors"
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
            >
              <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs mt-0.5 sm:mt-1">Visitors</span>
            </Link>
            <Link
              to="/notices"
              className={`flex flex-col items-center px-2 ${
                location.pathname === "/notices"
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
            >
              <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs mt-0.5 sm:mt-1">Notices</span>
            </Link>
            <Link
              to="/settings"
              className={`flex flex-col items-center px-2 ${
                location.pathname === "/settings"
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
            >
              <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs mt-0.5 sm:mt-1">More</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;