
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SupabaseAuthProvider } from "./context/supabase-auth-context";
import { AuthGuard } from "./components/auth/AuthGuard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Requests from "./pages/Requests";
import Schedule from "./pages/Schedule";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <SupabaseAuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              
              <Route path="/dashboard" element={
                <AuthGuard requireAdmin>
                  <Dashboard />
                </AuthGuard>
              } />
              
              <Route path="/schedule" element={
                <AuthGuard requireAdmin>
                  <Schedule />
                </AuthGuard>
              } />
              
              <Route path="/requests" element={
                <AuthGuard>
                  <Requests />
                </AuthGuard>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </SupabaseAuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
