
import React from "react";
import Layout from "@/components/Layout";
import FileUploader from "@/components/FileUploader";

const Upload = () => {
  return (
    <Layout>
      <div className="w-full max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Upload Invoice</h1>
        <p className="text-gray-600 mb-8 text-center">
          Upload your invoice in PDF, JPG, or PNG format to extract information
        </p>
        
        <FileUploader />
        
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Supported Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Vendor name and contact details extraction</span>
            </li>
            <li className="flex items-start">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Invoice amount and currency detection</span>
            </li>
            <li className="flex items-start">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Date recognition and formatting</span>
            </li>
            <li className="flex items-start">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Bank account and IBAN extraction</span>
            </li>
            <li className="flex items-start">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Smart expense categorization</span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
