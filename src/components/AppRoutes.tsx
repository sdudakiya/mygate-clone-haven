import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "./layout/Layout";
import Index from "@/pages/Index";
import Visitors from "@/pages/Visitors";
import Notices from "@/pages/Notices";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";

const AppRoutes = () => {
  const { session } = useAuth();

  if (!session) {
    // Store the current path before redirecting
    sessionStorage.setItem('intendedPath', window.location.pathname);
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Layout>
            <Index />
          </Layout>
        }
      />
      <Route
        path="/visitors"
        element={
          <Layout>
            <Visitors />
          </Layout>
        }
      />
      <Route
        path="/notices"
        element={
          <Layout>
            <Notices />
          </Layout>
        }
      />
      <Route
        path="/settings"
        element={
          <Layout>
            <Settings />
          </Layout>
        }
      />
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;