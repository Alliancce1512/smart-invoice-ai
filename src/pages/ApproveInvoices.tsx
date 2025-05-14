
import React from "react";
import Layout from "@/components/Layout";

const ApproveInvoices = () => {
  return (
    <Layout>
      <div className="w-full max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Approve Invoices</h1>
        <p className="text-gray-600 mb-8 text-center">
          Review and approve pending invoices
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">No Pending Invoices</h2>
          <p className="text-gray-600">
            There are currently no invoices waiting for your approval.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ApproveInvoices;
