
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
      
      <div className="sticky top-0 z-30 shadow-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-b border-gray-100 dark:border-gray-700">
        <header className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-xl sm:text-2xl font-bold text-foreground hover:text-smartinvoice-purple transition-colors"
            >
              <div className="h-9 w-9 bg-smartinvoice-purple/10 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-smartinvoice-purple" />
              </div>
              <span>SmartInvoice AI</span>
            </Link>
          </div>
        </header>
        
        {isAuthenticated && <Navigation />}
      </div>

      <main className="flex-1 container mx-auto px-4 py-2 animate-fade-in">
        {children}
      </main>

      <footer className="py-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
        <div className="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} SmartInvoice AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
