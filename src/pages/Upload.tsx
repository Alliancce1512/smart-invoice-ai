
import React from "react";
import Layout from "@/components/Layout";
import FileUploaderWrapper from "@/components/FileUploaderWrapper";
import { CheckIcon } from "lucide-react";

const Upload = () => {
  return (
    <Layout>
      <div className="w-full max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Upload Invoice</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
          Upload your invoice in PDF, JPG, or PNG format to extract information
        </p>
        
        <FileUploaderWrapper />
        
        <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/30 dark:border dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Supported Features</h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Vendor name and contact details extraction</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Invoice amount and currency detection</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Date recognition and formatting</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Bank account and IBAN extraction</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Smart expense categorization</span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
