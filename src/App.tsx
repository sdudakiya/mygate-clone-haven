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
import TestAuth from './contexts/TestAuth'; 

function App() {
    return (
        <AuthProvider>
             <TestAuth />
        </AuthProvider>
    )
}

export default App;
