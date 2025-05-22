
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Inbox, Users, Home, Upload, FileCheck, Menu, X, FileText, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation: React.FC = () => {
  const { isAuthenticated, accessConfig, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    {
      to: "/",
      label: "Home",
      icon: <Home className="w-4 h-4 mr-1" />,
      active: location.pathname === "/"
    },
    {
      to: "/upload",
      label: "Upload Invoice",
      icon: <Upload className="w-4 h-4 mr-1" />,
      active: location.pathname === "/upload"
    },
    {
      to: "/requests",
      label: "My Requests",
      icon: <FileText className="w-4 h-4 mr-1" />,
      active: location.pathname === "/requests"
    }
  ];

  // Add Review Invoices tab for users with canReviewInvoices permission
  if (accessConfig?.canReviewInvoices) {
    navItems.push({
      to: "/review",
      label: "Review Invoices",
      icon: <ClipboardCheck className="w-4 h-4 mr-1" />,
      active: location.pathname === "/review"
    });
  }

  // Admin-only navigation items
  if (accessConfig?.canApproveInvoices) {
    navItems.push(
      {
        to: "/approve",
        label: "Approve Invoices",
        icon: <FileCheck className="w-4 h-4 mr-1" />,
        active: location.pathname === "/approve"
      },
      {
        to: "/approved",
        label: "Approved Requests",
        icon: <Users className="w-4 h-4 mr-1" />,
        active: location.pathname === "/approved"
      }
    );
  }

  return (
    <nav className="bg-card shadow-sm sticky top-16 z-10 dark:bg-gray-800 dark:border-b dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Mobile menu button */}
          <div className="block md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-foreground"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:space-x-4 md:overflow-x-auto">
            {navItems.map((item, index) => (
              <Link 
                key={index}
                to={item.to}
                className={`text-foreground hover:text-smartinvoice-purple px-3 py-2 text-sm font-medium flex items-center ${
                  item.active ? "border-b-2 border-smartinvoice-purple" : ""
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Theme switcher and logout button */}
          <div className="flex items-center space-x-2">
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
              className="text-foreground hover:text-smartinvoice-purple px-3 py-2 text-sm font-medium hidden sm:block"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background dark:bg-gray-800 border-t dark:border-gray-700 py-2 animate-fade-in">
            {navItems.map((item, index) => (
              <Link 
                key={index}
                to={item.to}
                className={`block px-4 py-3 text-foreground hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${
                  item.active ? "bg-gray-50 dark:bg-gray-700" : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span className="ml-1">{item.label}</span>
              </Link>
            ))}
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-3 text-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
