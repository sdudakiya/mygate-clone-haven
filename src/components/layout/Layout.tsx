import Navbar from "./Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;