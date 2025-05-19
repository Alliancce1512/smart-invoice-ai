
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import InvoiceResult from "@/components/InvoiceResult";
import { toast } from "@/hooks/use-toast";

const Results = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating loading of the most recent extraction results
    setIsLoading(true);
    // We'll just use an empty array for now as this is just a placeholder
    // In a real app, this would fetch the latest extraction results
    setTimeout(() => {
      setInvoices([]);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Results refreshed",
        description: "The latest extraction results have been loaded.",
      });
    }, 500);
  };

  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center dark:text-white">Invoice Results</h1>
        <p className="text-gray-600 mb-8 text-center dark:text-gray-300">
          Review the extracted information and send for review
        </p>
        
        <InvoiceResult 
          invoices={invoices} 
          isLoading={isLoading} 
          onRefresh={handleRefresh}
        />
      </div>
    </Layout>
  );
};

export default Results;
