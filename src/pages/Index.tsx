
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SuccessMessage {
  vendor: string;
  action: 'submitted' | 'approved';
}

const Index = () => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState<SuccessMessage | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for success message in session storage
    const messageJson = sessionStorage.getItem("invoiceSuccessMessage");
    if (messageJson) {
      try {
        const message = JSON.parse(messageJson) as SuccessMessage;
        setSuccessMessage(message);
        setShowSuccessDialog(true);
        // Clear the message so it doesn't show again on refresh
        sessionStorage.removeItem("invoiceSuccessMessage");
      } catch (error) {
        console.error("Failed to parse success message:", error);
      }
    }
  }, []);
  
  const handleProcessAnother = () => {
    setShowSuccessDialog(false);
    navigate("/upload");
  };
  
  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto py-8 sm:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground tracking-tight">
            Welcome to SmartInvoice AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Automate your invoice processing with powerful AI recognition
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800/50 dark:hover:bg-gray-800/70">
            <h2 className="text-2xl font-semibold mb-3 dark:text-white">Upload &amp; Process</h2>
            <p className="text-muted-foreground mb-4 dark:text-gray-300">
              Upload your invoice and let our AI extract all important information automatically.
            </p>
            <Button 
              onClick={() => navigate("/upload")}
              className="bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark text-white"
            >
              Get Started
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800/50 dark:hover:bg-gray-800/70">
            <h2 className="text-2xl font-semibold mb-3 dark:text-white">View Invoices</h2>
            <p className="text-muted-foreground mb-4 dark:text-gray-300">
              Check the status of your submitted and processed invoices.
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate("/requests")}
              className="dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
            >
              View My Requests
            </Button>
          </div>
        </div>
      </div>

      {/* Success dialog after submission */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-white">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span>Invoice {successMessage?.action === 'approved' ? 'Approved' : 'Submitted'} Successfully</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 dark:text-gray-300">
              The invoice for <span className="font-semibold dark:text-white">{successMessage?.vendor || 'vendor'}</span> has been {successMessage?.action === 'approved' ? 'approved and saved' : 'submitted for approval'}.
            </p>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button 
              onClick={() => setShowSuccessDialog(false)} 
              variant="outline"
              className="dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Close
            </Button>
            <Button 
              onClick={handleProcessAnother} 
              className="bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark"
            >
              Process Another Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Index;
