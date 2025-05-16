
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { submitInvoice } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle } from "lucide-react";

interface InvoiceData {
  vendor: string;
  amount: number;
  currency: string;
  date?: string; // The date field from backend
  invoiceDate?: string; // For compatibility with previous code
  iban: string;
  category: string;
  needsApproval?: boolean; // From backend
  approved?: boolean; // For compatibility with previous code
  [key: string]: any; // Allow for additional properties in the API response
}

const InvoiceResult = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  const { accessConfig } = useAuth();
  const canApproveInvoices = accessConfig?.canApproveInvoices || false;

  useEffect(() => {
    // Get stored data from the upload process
    const storedData = sessionStorage.getItem("invoiceData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setInvoiceData(parsedData);
      } catch (error) {
        console.error("Failed to parse invoice data:", error);
        navigate("/");
      }
    } else {
      // Redirect if no data is found
      navigate("/");
    }
  }, [navigate]);

  if (!invoiceData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4 dark:bg-gray-700"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mb-2 dark:bg-gray-700"></div>
          <div className="h-4 w-32 bg-gray-200 rounded dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  // Get the invoice date from either the date or invoiceDate field
  const getInvoiceDate = () => {
    if (invoiceData.invoiceDate) return invoiceData.invoiceDate;
    if (invoiceData.date) return invoiceData.date;
    return "N/A";
  };
  
  // Get the approval status from either needsApproval or approved field
  const isApproved = () => {
    if (invoiceData.approved !== undefined) return invoiceData.approved;
    if (invoiceData.needsApproval !== undefined) return !invoiceData.needsApproval;
    return false;
  };

  // Format the date to dd.MM.yyyy regardless of input format
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    
    try {
      // Try to parse the date
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid
      }
      
      // Format to dd.MM.yyyy
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}.${month}.${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return the original string if parsing fails
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (amount === undefined || amount === null) return "N/A";
    
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD"
      }).format(amount);
    } catch (error) {
      console.error("Error formatting currency:", error);
      return `${amount} ${currency || ""}`;
    }
  };

  const handleSubmitInvoice = async () => {
    if (!invoiceData) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare the invoice data for submission, ensuring date is in dd.MM.yyyy format
      const formattedDate = formatDate(getInvoiceDate());
      
      const submitData = {
        vendor: invoiceData.vendor,
        invoiceDate: formattedDate,
        amount: invoiceData.amount,
        currency: invoiceData.currency,
        iban: invoiceData.iban || "",
        category: invoiceData.category || "Other",
      };

      // Submit the invoice
      const response = await submitInvoice(submitData, canApproveInvoices);
      
      if (response.status === 0) {
        // Store success message to show on the home page
        sessionStorage.setItem("invoiceSuccessMessage", JSON.stringify({
          vendor: invoiceData.vendor,
          action: canApproveInvoices ? 'approved' : 'submitted'
        }));
        
        // Navigate to home after successful submission
        navigate("/");
      } else {
        toast.error("Failed to submit invoice. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting invoice:", error);
      toast.error("Failed to submit invoice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProcessAnother = () => {
    navigate("/upload");
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-scale-in">
      <Card className="card-shadow dark:bg-gray-800/80 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold dark:text-white">Invoice Details</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={isApproved() ? "default" : "secondary"} 
              className={`${isApproved() ? "bg-green-600" : "bg-amber-500"} text-white`}
            >
              {isApproved() ? "Auto-approved" : "Needs review"}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowJson(!showJson)}
              className="dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
            >
              {showJson ? "Hide JSON" : "View JSON"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showJson ? (
            <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96 dark:bg-gray-900 dark:text-gray-200">
              <pre className="text-xs text-gray-800 dark:text-gray-200">{JSON.stringify(invoiceData, null, 2)}</pre>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="vendor" className="text-gray-500 dark:text-gray-300">Vendor Name</Label>
                  <div id="vendor" className="font-medium text-lg mt-1 dark:text-white">{invoiceData.vendor || "N/A"}</div>
                </div>
                <div>
                  <Label htmlFor="amount" className="text-gray-500 dark:text-gray-300">Amount</Label>
                  <div id="amount" className="font-medium text-lg mt-1 dark:text-white">
                    {formatCurrency(invoiceData.amount, invoiceData.currency)}
                  </div>
                </div>
                <div>
                  <Label htmlFor="date" className="text-gray-500 dark:text-gray-300">Invoice Date</Label>
                  <div id="date" className="font-medium mt-1 dark:text-white">{formatDate(getInvoiceDate())}</div>
                </div>
                <div>
                  <Label htmlFor="iban" className="text-gray-500 dark:text-gray-300">IBAN</Label>
                  <div id="iban" className="font-medium font-mono mt-1 text-sm dark:text-white">{invoiceData.iban || "N/A"}</div>
                </div>
              </div>

              <div className="pt-4">
                <Label htmlFor="category" className="text-gray-500 dark:text-gray-300 block mb-1">Expense Category</Label>
                <div id="category" className="font-medium px-3 py-2 border border-gray-200 rounded bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600">
                  {invoiceData.category || "Other"}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  className="bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark"
                  disabled={isSubmitting}
                  onClick={handleSubmitInvoice}
                >
                  {isSubmitting ? 'Processing...' : canApproveInvoices ? 'Approve & Save' : 'Submit Invoice'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success dialog is no longer needed here as we now redirect to home directly */}
    </div>
  );
};

export default InvoiceResult;
