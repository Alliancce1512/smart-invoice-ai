
import React from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navigation from "./Navigation";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col gradient-background relative">
      {/* Abstract shapes for background */}
      <div className="abstract-shape shape1"></div>
      <div className="abstract-shape shape2"></div>
      <div className="abstract-shape shape3"></div>
      
      <header className="w-full p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-bold text-smartinvoice-dark hover:text-smartinvoice-purple transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8"
            >
              <path d="M14 3v4a1 1 0 0 0 1 1h4" />
              <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
              <path d="M9.5 12h5" />
              <path d="M9.5 16h5" />
            </svg>
            <span>SmartInvoice AI</span>
          </Link>
        </div>
      </header>

      {isAuthenticated && <Navigation />}

      <main className="flex-1 container mx-auto p-4 animate-fade-in">
        {children}
      </main>

      <footer className="py-6 border-t border-gray-100">
        <div className="container mx-auto text-center text-sm text-gray-500">
          © {new Date().getFullYear()} SmartInvoice AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
