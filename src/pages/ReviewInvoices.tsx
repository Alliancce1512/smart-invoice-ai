
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getInvoicesForReview, markInvoiceForApproval, declineInvoice } from "@/utils/api";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, RefreshCw } from "lucide-react";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import Layout from "@/components/Layout";
import DeclineInvoiceDialog from "@/components/DeclineInvoiceDialog";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

const ReviewInvoices = () => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
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
  
  // Calculate pagination
  const totalPages = Math.ceil(invoices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInvoices = invoices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleSendForApproval = async (invoiceId: number) => {
    try {
      await markInvoiceForApproval(invoiceId);
      refetch();
      toast.success("Invoice sent for approval");
    } catch (error) {
      toast.error("Error sending invoice for approval");
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
        toast.success("Invoice declined");
      } catch (error) {
        toast.error("Error declining invoice");
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

  const handleRefresh = () => {
    refetch();
    toast.info("Refreshing invoices...");
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
            action={{
              label: "Refresh",
              href: "#",
              onClick: (e) => {
                e.preventDefault();
                handleRefresh();
              }
            }}
          />
        ) : (
          <div className="space-y-4">
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
                    {paginatedInvoices.map((invoice) => (
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

            {/* Pagination controls */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => handlePageChange(page)}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}

            {/* Refresh button */}
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="text-gray-600 hover:text-gray-800"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
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
