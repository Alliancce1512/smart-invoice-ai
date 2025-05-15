
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, Inbox, FileCheck } from "lucide-react";
import { toast } from "sonner";

const Index: React.FC = () => {
  const { accessConfig } = useAuth();
  
  useEffect(() => {
    // Check if there's a success message from invoice submission
    const successMessage = sessionStorage.getItem("invoiceSuccessMessage");
    if (successMessage) {
      try {
        const { vendor, action } = JSON.parse(successMessage);
        toast.success(`Invoice for ${vendor} has been ${action} successfully!`);
        // Remove the message after displaying it
        sessionStorage.removeItem("invoiceSuccessMessage");
      } catch (error) {
        console.error("Error parsing success message:", error);
      }
    }
  }, []);

  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Welcome to SmartInvoice AI</h1>
        <p className="text-gray-600 mb-8 text-center dark:text-gray-300">
          Easily manage, process, and approve invoices with the power of AI
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800/80">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto flex items-center justify-center dark:bg-purple-900/30">
                  <Upload className="h-6 w-6 text-smartinvoice-purple" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-center mb-4 dark:text-white">Upload Invoice</h2>
              <p className="text-gray-500 mb-6 text-center dark:text-gray-400">
                Upload and process invoices instantly with our intelligent OCR system.
              </p>
              <div className="flex justify-center">
                <Button asChild className="bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark">
                  <Link to="/upload">Upload Invoice</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800/80">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto flex items-center justify-center dark:bg-purple-900/30">
                  <Inbox className="h-6 w-6 text-smartinvoice-purple" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-center mb-4 dark:text-white">My Requests</h2>
              <p className="text-gray-500 mb-6 text-center dark:text-gray-400">
                View all your submitted invoices and check their approval status.
              </p>
              <div className="flex justify-center">
                <Button asChild variant="outline">
                  <Link to="/requests">View Requests</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {accessConfig?.canApproveInvoices && (
            <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800/80">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto flex items-center justify-center dark:bg-purple-900/30">
                    <FileCheck className="h-6 w-6 text-smartinvoice-purple" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-center mb-4 dark:text-white">Approve Invoices</h2>
                <p className="text-gray-500 mb-6 text-center dark:text-gray-400">
                  Review and approve pending invoices from your team members.
                </p>
                <div className="flex justify-center">
                  <Button asChild variant="outline">
                    <Link to="/approve">Approve Invoices</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
