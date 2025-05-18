
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
import { Edit, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EXPENSE_CATEGORIES = [
  "Cloud Services", 
  "Software Subscriptions", 
  "Office Supplies", 
  "Travel", 
  "Meals & Entertainment", 
  "Training & Education", 
  "Consulting Services", 
  "Legal & Accounting", 
  "Marketing & Advertising", 
  "Equipment", 
  "Utilities", 
  "SaaS Tools", 
  "Events & Conferences", 
  "Transportation", 
  "Other"
];

interface InvoiceData {
  vendor: string;
  amount: number;
  currency: string;
  date?: string; // The date field from backend
  invoiceDate?: string; // For compatibility with previous code
  iban: string;
  category: string;
  [key: string]: any; // Allow for additional properties in the API response
}

const InvoiceResult = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [editedInvoiceData, setEditedInvoiceData] = useState<InvoiceData | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
        setEditedInvoiceData(parsedData);
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
    if (isEditing ? editedInvoiceData?.invoiceDate : invoiceData?.invoiceDate) 
      return isEditing ? editedInvoiceData?.invoiceDate : invoiceData?.invoiceDate;
    if (isEditing ? editedInvoiceData?.date : invoiceData?.date) 
      return isEditing ? editedInvoiceData?.date : invoiceData?.date;
    return "N/A";
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
    if (!editedInvoiceData) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare the invoice data for submission, ensuring date is in dd.MM.yyyy format
      const formattedDate = formatDate(getInvoiceDate());
      
      const submitData = {
        vendor: editedInvoiceData.vendor,
        invoiceDate: formattedDate,
        amount: editedInvoiceData.amount,
        currency: editedInvoiceData.currency,
        iban: editedInvoiceData.iban || "",
        category: editedInvoiceData.category || "Other",
        edited: JSON.stringify(invoiceData) !== JSON.stringify(editedInvoiceData)
      };

      // Submit the invoice
      const response = await submitInvoice(submitData, canApproveInvoices);
      
      if (response.status === 0) {
        // Store success message to show on the home page
        sessionStorage.setItem("invoiceSuccessMessage", JSON.stringify({
          vendor: editedInvoiceData.vendor,
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (editedInvoiceData) {
      setEditedInvoiceData({
        ...editedInvoiceData,
        [field]: value
      });
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
              <pre className="text-xs text-gray-800 dark:text-gray-200">{JSON.stringify(isEditing ? editedInvoiceData : invoiceData, null, 2)}</pre>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-end mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleEditToggle}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  {isEditing ? "Cancel Editing" : "Edit"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="vendor" className="text-gray-500 dark:text-gray-300">Vendor Name</Label>
                  {isEditing ? (
                    <Input 
                      id="vendor"
                      value={editedInvoiceData?.vendor || ""}
                      onChange={(e) => handleInputChange("vendor", e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <div id="vendor" className="font-medium text-lg mt-1 dark:text-white">{invoiceData.vendor || "N/A"}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="amount" className="text-gray-500 dark:text-gray-300">Amount</Label>
                  {isEditing ? (
                    <div className="flex gap-2 mt-1">
                      <Input 
                        id="amount"
                        type="number"
                        value={editedInvoiceData?.amount || 0}
                        onChange={(e) => handleInputChange("amount", parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <Select
                        value={editedInvoiceData?.currency || "USD"}
                        onValueChange={(value) => handleInputChange("currency", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="BGN">BGN</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div id="amount" className="font-medium text-lg mt-1 dark:text-white">
                      {formatCurrency(invoiceData.amount, invoiceData.currency)}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="date" className="text-gray-500 dark:text-gray-300">Invoice Date</Label>
                  {isEditing ? (
                    <Input 
                      id="date"
                      type="date"
                      value={editedInvoiceData?.date || ""}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <div id="date" className="font-medium mt-1 dark:text-white">{formatDate(getInvoiceDate())}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="iban" className="text-gray-500 dark:text-gray-300">IBAN</Label>
                  {isEditing ? (
                    <Input 
                      id="iban"
                      value={editedInvoiceData?.iban || ""}
                      onChange={(e) => handleInputChange("iban", e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <div id="iban" className="font-medium mt-1 dark:text-white">{invoiceData.iban || "N/A"}</div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Label htmlFor="category" className="text-gray-500 dark:text-gray-300 block mb-1">Expense Category</Label>
                {isEditing ? (
                  <Select
                    value={editedInvoiceData?.category || "Other"}
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div id="category" className="font-medium px-3 py-2 border border-gray-200 rounded bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    {invoiceData.category || "Other"}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  className="bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark"
                  disabled={isSubmitting}
                  onClick={handleSubmitInvoice}
                >
                  {isSubmitting ? 'Processing...' : 'Send for Review'}
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
