
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import InvoiceResult from "@/components/InvoiceResult";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import EditInvoiceDialog from "@/components/EditInvoiceDialog";
import { submitInvoice } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Results = () => {
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { accessConfig } = useAuth();

  useEffect(() => {
    // Load invoice data from session storage
    const loadInvoiceData = () => {
      setIsLoading(true);
      try {
        const data = sessionStorage.getItem("invoiceData");
        if (!data) {
          toast.error("No invoice data found. Please upload an invoice first.");
          navigate("/upload");
          return;
        }
        
        setInvoiceData(JSON.parse(data));
      } catch (error) {
        console.error("Error loading invoice data:", error);
        toast.error("Error loading invoice data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInvoiceData();
  }, [navigate]);

  const handleGoBack = () => {
    navigate("/upload");
  };

  const handleEditInvoice = () => {
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  const handleSendInvoice = async (editedInvoice: any) => {
    setIsSubmitting(true);
    try {
      // The canApprove parameter is based on the user's access config
      const canApprove = accessConfig?.canApproveInvoices || false;
      
      await submitInvoice(editedInvoice, canApprove);
      
      toast.success("Invoice submitted successfully!");
      navigate("/requests");
    } catch (error) {
      console.error("Error submitting invoice:", error);
      toast.error("Failed to submit invoice. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsEditing(false);
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center mb-4">
          <Button
            variant="outline"
            size="sm"
            className="mr-2"
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-0 ml-2 dark:text-white">Invoice Results</h1>
        </div>
        <p className="text-gray-600 mb-8 dark:text-gray-300">
          Review the extracted information before submitting
        </p>
        
        {invoiceData && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900/30 dark:border dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Invoice Details</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Vendor</dt>
                  <dd className="mt-1 text-lg text-gray-900 dark:text-white">{invoiceData.vendor}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</dt>
                  <dd className="mt-1 text-lg text-gray-900 dark:text-white">{invoiceData.date}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</dt>
                  <dd className="mt-1 text-lg text-gray-900 dark:text-white">
                    {invoiceData.amount} {invoiceData.currency}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">IBAN</dt>
                  <dd className="mt-1 text-lg text-gray-900 dark:text-white">{invoiceData.iban || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</dt>
                  <dd className="mt-1 text-lg text-gray-900 dark:text-white">{invoiceData.category}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Approval Required</dt>
                  <dd className="mt-1 text-lg text-gray-900 dark:text-white">
                    {invoiceData.needsApproval ? "Yes" : "No"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={handleEditInvoice}
                className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
              >
                Edit Details
              </Button>
              <Button
                onClick={() => handleSendInvoice(invoiceData)}
                disabled={isSubmitting}
                className="bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark transition-all duration-300"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Submit Invoice"
                )}
              </Button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-smartinvoice-purple"></div>
          </div>
        )}

        {/* Edit dialog */}
        <EditInvoiceDialog
          isOpen={isEditing}
          onClose={handleCloseEdit}
          onSend={handleSendInvoice}
          invoice={invoiceData}
        />
      </div>
    </Layout>
  );
};

export default Results;
