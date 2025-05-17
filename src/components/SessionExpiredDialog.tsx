
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ExclamationTriangleIcon } from "lucide-react";

interface SessionExpiredDialogProps {
  isOpen: boolean;
}

export const SessionExpiredDialog: React.FC<SessionExpiredDialogProps> = ({ isOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleBackToLogin = () => {
    // Perform logout operations and redirect to login page
    logout();
    navigate("/login");
  };
  
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-amber-500">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <AlertDialogTitle>Session Expired</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Your session has expired. For your security, please log in again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={handleBackToLogin}
            className="bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark w-full"
          >
            Back to Login
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
