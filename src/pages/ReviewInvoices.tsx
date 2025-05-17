
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { getInvoicesForReview, markInvoiceForApproval, declineInvoice } from "@/utils/api";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import Layout from "@/components/Layout";
import DeclineInvoiceDialog from "@/components/DeclineInvoiceDialog";

const ReviewInvoices = () => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  
  const username = localStorage.getItem("smartinvoice_user_id") || "";
  
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["reviewInvoices", username],
    queryFn: () => getInvoicesForReview(username),
  });
  
  const invoices = data?.invoices || [];
  
  const handleSendForApproval = async (invoiceId: number) => {
    try {
      await markInvoiceForApproval(invoiceId);
      refetch();
    } catch (error) {
      console.error("Error sending invoice for approval:", error);
    }
  };
  
  const openDeclineDialog = (invoiceId: number) => {
    setSelectedInvoiceId(invoiceId);
    setIsDeclineDialogOpen(true);
  };
  
  const handleDeclineConfirm = async (reason: string) => {
    if (selectedInvoiceId) {
      try {
        await declineInvoice(selectedInvoiceId, reason);
        refetch();
      } catch (error) {
        console.error("Error declining invoice:", error);
      }
      setIsDeclineDialogOpen(false);
      setSelectedInvoiceId(null);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd.MM.yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  const formatCurrency = (amount: string | number, currency: string = "USD") => {
    if (!amount) return "-";
    
    try {
      const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
      if (isNaN(numericAmount)) return "-";
      
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
      }).format(numericAmount);
    } catch (error) {
      return `${currency || "$"}${parseFloat(amount as string).toFixed(2)}`;
    }
  };
  
  return (
    <Layout>
      <div className="container max-w-screen-xl mx-auto py-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Review Invoices</h1>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Loading invoices...</p>
          </div>
        ) : isError ? (
          <div className="p-6 text-center">
            <p className="text-red-500">Failed to load invoices for review. Please try again.</p>
            <Button onClick={() => refetch()} className="mt-4">
              Retry
            </Button>
          </div>
        ) : invoices.length === 0 || (invoices.length === 1 && Object.keys(invoices[0]).length === 0) ? (
          <EmptyPlaceholder
            title="No invoices to review"
            description="When invoices are submitted, they'll appear here for your review."
            icon={<X className="h-10 w-10 text-muted-foreground" />}
          />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Invoice Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.vendor}</TableCell>
                      <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                      <TableCell>{formatCurrency(invoice.amount, invoice.currency)}</TableCell>
                      <TableCell>{invoice.category}</TableCell>
                      <TableCell>{invoice.submittedBy}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSendForApproval(invoice.id)}
                            className="bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Send for Approval
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDeclineDialog(invoice.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
      
      <DeclineInvoiceDialog
        isOpen={isDeclineDialogOpen}
        onClose={() => setIsDeclineDialogOpen(false)}
        onConfirm={handleDeclineConfirm}
      />
    </Layout>
  );
};

export default ReviewInvoices;
