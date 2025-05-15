
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { submitInvoice } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle } from "lucide-react";

interface InvoiceData {
  vendor: string;
  amount: number;
  currency: string;
  date: string;
  invoiceDate: string;
  iban: string;
  category: string;
  approved: boolean;
  [key: string]: any; // Allow for additional properties in the API response
}

const InvoiceResult = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [category, setCategory] = useState("");
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
        setCategory(parsedData.category || "");
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
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

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setInvoiceData(prev => prev ? { ...prev, category: value } : null);
  };

  const handleSubmitInvoice = async () => {
    if (!invoiceData) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare the invoice data for submission
      const submitData = {
        vendor: invoiceData.vendor,
        invoiceDate: invoiceData.invoiceDate,
        amount: invoiceData.amount,
        currency: invoiceData.currency,
        iban: invoiceData.iban || "",
        category: category || invoiceData.category || "Other",
      };

      // Submit the invoice
      await submitInvoice(submitData, canApproveInvoices);
      
      // Show confirmation dialog
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error submitting invoice:", error);
      toast.error("Failed to submit invoice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    navigate("/");
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-scale-in">
      <Card className="card-shadow dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Invoice Details</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={invoiceData.approved ? "default" : "secondary"} 
              className={`${invoiceData.approved ? "bg-green-600" : "bg-amber-500"} text-white`}
            >
              {invoiceData.approved ? "Auto-approved" : "Needs review"}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowJson(!showJson)}
            >
              {showJson ? "Hide JSON" : "View JSON"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showJson ? (
            <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96 dark:bg-gray-900">
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
                  <div id="date" className="font-medium mt-1 dark:text-white">{invoiceData.invoiceDate}</div>
                </div>
                <div>
                  <Label htmlFor="iban" className="text-gray-500 dark:text-gray-300">IBAN</Label>
                  <div id="iban" className="font-medium font-mono mt-1 text-sm dark:text-white">{invoiceData.iban || "N/A"}</div>
                </div>
              </div>

              <div className="pt-4">
                <Label htmlFor="category" className="text-gray-500 dark:text-gray-300 block mb-1">Expense Category</Label>
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full md:w-[280px] dark:bg-gray-700 dark:text-white">
                    <SelectValue placeholder="Select expense category" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800">
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                    <SelectItem value="Software & Services">Software & Services</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Cloud Services">Cloud Services</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => navigate("/")} className="dark:text-white dark:border-gray-600">
                  Process Another Invoice
                </Button>
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

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span>Invoice {canApproveInvoices ? 'Approved' : 'Submitted'} Successfully</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 dark:text-gray-300">
              The invoice for <span className="font-semibold dark:text-white">{invoiceData.vendor}</span> has been {canApproveInvoices ? 'approved and saved' : 'submitted for approval'}.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleCloseConfirmation} className="w-full sm:w-auto bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark">
              Process Another Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceResult;
