import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Visitors from "./pages/Visitors";
import Notices from "./pages/Notices";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Cache is kept for 30 minutes
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnMount: false, // Don't refetch on component mount
      retry: 1, // Only retry failed requests once
      placeholderData: 'keep-previous', // Keep showing old data while fetching new data
    },
  },
});

const LoadingState = () => (
  <Layout>
    <div className="space-y-4 p-4">
      <Skeleton className="h-12 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    </div>
  </Layout>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  return <Layout>{children}</Layout>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      }
    />
    <Route
      path="/visitors"
      element={
        <ProtectedRoute>
          <Visitors />
        </ProtectedRoute>
      }
    />
    <Route
      path="/notices"
      element={
        <ProtectedRoute>
          <Notices />
        </ProtectedRoute>
      }
    />
    <Route
      path="/settings"
      element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      }
    />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;