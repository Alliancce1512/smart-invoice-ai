
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navigation: React.FC = () => {
  const { isAuthenticated, accessConfig, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex space-x-8">
            <Link 
              to="/"
              className={`text-gray-700 hover:text-smartinvoice-purple px-3 py-2 text-sm font-medium ${
                location.pathname === "/" ? "border-b-2 border-smartinvoice-purple" : ""
              }`}
            >
              Home
            </Link>
            <Link 
              to="/upload"
              className={`text-gray-700 hover:text-smartinvoice-purple px-3 py-2 text-sm font-medium ${
                location.pathname === "/upload" ? "border-b-2 border-smartinvoice-purple" : ""
              }`}
            >
              Upload Invoice
            </Link>
            {accessConfig && accessConfig.canApproveInvoices === true && (
              <Link 
                to="/approve"
                className={`text-gray-700 hover:text-smartinvoice-purple px-3 py-2 text-sm font-medium ${
                  location.pathname === "/approve" ? "border-b-2 border-smartinvoice-purple" : ""
                }`}
              >
                Approve Invoices
              </Link>
            )}
          </div>
          <div>
            <button
              onClick={logout}
              className="text-gray-700 hover:text-smartinvoice-purple px-3 py-2 text-sm font-medium"
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
