
import React from "react";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { FileText } from "lucide-react";

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
      
      <header className="w-full border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl sm:text-2xl font-bold text-foreground hover:text-smartinvoice-purple transition-colors"
          >
            <FileText className="h-7 w-7" />
            <span>SmartInvoice AI</span>
          </Link>
        </div>
      </header>

      {isAuthenticated && <Navigation />}

      <main className="flex-1 container mx-auto p-4 animate-fade-in">
        {children}
      </main>

      <footer className="py-4 sm:py-6 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} SmartInvoice AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
