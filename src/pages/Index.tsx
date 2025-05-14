
import React from "react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center text-center animate-fade-in py-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-smartinvoice-purple to-smartinvoice-bright-blue">
            SmartInvoice AI
          </h1>
          
          <p className="text-xl md:text-2xl mb-10 text-gray-700">
            AI-powered invoice processing. Upload, extract, and auto-approve in seconds.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-smartinvoice-soft-gray rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-smartinvoice-purple"
                >
                  <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                  <path d="M5 8v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7.5L14.5 3H6a1 1 0 0 0-1 1z"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Upload</h3>
              <p className="text-gray-600">
                Drag and drop your invoices or upload them in seconds
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-smartinvoice-soft-gray rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-smartinvoice-purple"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Extract</h3>
              <p className="text-gray-600">
                Our AI automatically extracts all relevant information
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-smartinvoice-soft-gray rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-smartinvoice-purple"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Approve</h3>
              <p className="text-gray-600">
                Get smart approval recommendations based on your history
              </p>
            </div>
          </div>
          
          <Link to="/upload" className="inline-block">
            <Button size="lg" className="text-lg bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark hover-scale">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
