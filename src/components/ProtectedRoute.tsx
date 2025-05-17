
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { registerSessionExpiredCallback } from "@/utils/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, setSessionExpired } = useAuth();

  // Register the session expired callback when component mounts
  useEffect(() => {
    registerSessionExpiredCallback(setSessionExpired);
  }, [setSessionExpired]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
