
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Upload from "@/pages/Upload";
import Results from "@/pages/Results";
import Login from "@/pages/Login";
import MyRequests from "@/pages/MyRequests";
import ApprovedRequests from "@/pages/ApprovedRequests";
import ApproveInvoices from "@/pages/ApproveInvoices";
import ReviewInvoices from "@/pages/ReviewInvoices";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SessionExpiredDialog } from "@/components/SessionExpiredDialog";
import { useAuth } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

// Session manager component to handle the session expired dialog
const SessionManager = ({ children }: { children: React.ReactNode }) => {
  const { sessionExpired } = useAuth();
  
  return (
    <>
      {children}
      <SessionExpiredDialog isOpen={sessionExpired} />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <SessionManager>
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
                  path="/upload" 
                  element={
                    <ProtectedRoute>
                      <Upload />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/results" 
                  element={
                    <ProtectedRoute>
                      <Results />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/approve" 
                  element={
                    <ProtectedRoute>
                      <ApproveInvoices />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/review" 
                  element={
                    <ProtectedRoute>
                      <ReviewInvoices />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/requests" 
                  element={
                    <ProtectedRoute>
                      <MyRequests />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/approved" 
                  element={
                    <ProtectedRoute>
                      <ApprovedRequests />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SessionManager>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
