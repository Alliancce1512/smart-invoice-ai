
import React from "react";
import Layout from "@/components/Layout";
import InvoiceResult from "@/components/InvoiceResult";

const Results = () => {
  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center dark:text-white">Invoice Results</h1>
        <p className="text-gray-600 mb-8 text-center dark:text-gray-300">
          Review the extracted information and send for review
        </p>
        
        <InvoiceResult />
      </div>
    </Layout>
  );
};

export default Results;
