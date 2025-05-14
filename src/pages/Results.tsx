
import React from "react";
import Layout from "@/components/Layout";
import InvoiceResult from "@/components/InvoiceResult";

const Results = () => {
  return (
    <Layout>
      <div className="w-full max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Invoice Results</h1>
        <p className="text-gray-600 mb-8 text-center">
          Review the extracted information and approve or edit as needed
        </p>
        
        <InvoiceResult />
      </div>
    </Layout>
  );
};

export default Results;
