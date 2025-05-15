
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Inbox, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation: React.FC = () => {
  const { isAuthenticated, accessConfig, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-card shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex space-x-4 overflow-x-auto">
            <Link 
              to="/"
              className={`text-foreground hover:text-smartinvoice-purple px-3 py-2 text-sm font-medium ${
                location.pathname === "/" ? "border-b-2 border-smartinvoice-purple" : ""
              }`}
            >
              Home
            </Link>
            <Link 
              to="/upload"
              className={`text-foreground hover:text-smartinvoice-purple px-3 py-2 text-sm font-medium ${
                location.pathname === "/upload" ? "border-b-2 border-smartinvoice-purple" : ""
              }`}
            >
              Upload Invoice
            </Link>
            <Link 
              to="/requests"
              className={`text-foreground hover:text-smartinvoice-purple px-3 py-2 text-sm font-medium flex items-center ${
                location.pathname === "/requests" ? "border-b-2 border-smartinvoice-purple" : ""
              }`}
            >
              <Inbox className="w-4 h-4 mr-1" />
              My Requests
            </Link>
            {accessConfig?.canApproveInvoices && (
              <>
                <Link 
                  to="/approve"
                  className={`text-foreground hover:text-smartinvoice-purple px-3 py-2 text-sm font-medium ${
                    location.pathname === "/approve" ? "border-b-2 border-smartinvoice-purple" : ""
                  }`}
                >
                  Approve Invoices
                </Link>
                <Link 
                  to="/approved"
                  className={`text-foreground hover:text-smartinvoice-purple px-3 py-2 text-sm font-medium flex items-center ${
                    location.pathname === "/approved" ? "border-b-2 border-smartinvoice-purple" : ""
                  }`}
                >
                  <Users className="w-4 h-4 mr-1" />
                  Approved Requests
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <button
              onClick={logout}
              className="text-foreground hover:text-smartinvoice-purple px-3 py-2 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
