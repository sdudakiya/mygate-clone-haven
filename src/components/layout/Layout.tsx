import Navbar from "./Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;