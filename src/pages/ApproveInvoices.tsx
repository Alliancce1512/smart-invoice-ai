
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, RefreshCw, FileText } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { getInvoicesForApproval, approveInvoice } from "@/utils/api";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Invoice {
  id: number;
  vendor: string;
  invoiceDate: string;
  amount: number;
  currency: string;
  iban: string;
  category: string;
  approved: boolean;
  submittedBy: string;
  submittedAt: string;
  reviewedBy?: string;
}

const ITEMS_PER_PAGE = 10;

const ApproveInvoices = () => {
  const { userId } = useAuth();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const fetchInvoices = async (): Promise<Invoice[]> => {
    if (!userId) {
      return [];
    }
    const response = await getInvoicesForApproval(userId);
    return response.invoices && Array.isArray(response.invoices) && response.invoices.length > 0 
      ? response.invoices 
      : [];
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["invoicesForApproval"],
    queryFn: fetchInvoices,
  });
  
  const invoices: Invoice[] = data || []; // Use data directly as it should be Invoice[]
  const hasInvoices = Array.isArray(invoices) && invoices.length > 0 && invoices[0] && Object.keys(invoices[0]).length > 0;

  const handleApprove = async (invoice: Invoice) => {
    try {
      await approveInvoice(invoice);
      toast.success("Invoice approved successfully.");
      refetch();
    } catch (error) {
      console.error("Failed to approve invoice:", error);
      toast.error("Failed to approve invoice. Please try again.");
    }
  };

  const formatInvoiceDate = (dateString: string) => {
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
    } catch {
      return dateString;
    }
  };
  
  const formatCurrency = (amount: number, currency: string) => {
    // Add a default currency code if none is provided
    const currencyCode = currency || "USD";
    
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      // Fallback to basic formatting if Intl.NumberFormat fails
      return `${amount.toFixed(2)} ${currencyCode}`;
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(invoices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInvoices = invoices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    refetch();
    toast.info("Refreshing invoices...");
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Approve Invoices</h1>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Loading invoices...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-8">
            <p className="text-red-500">Error loading invoices. Please try again.</p>
            <Button onClick={() => refetch()} className="mt-4">Retry</Button>
          </div>
        ) : !hasInvoices ? (
          <EmptyPlaceholder
            icon={<FileText className="h-12 w-12 text-muted-foreground" />}
            title="No Pending Invoices"
            description="There are currently no invoices waiting for your approval"
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
            <Card className="w-full overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Reviewed By</TableHead>
                      <TableHead className="w-[100px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedInvoices.map((invoice) => (
                      <TableRow key={invoice.id || Math.random()}>
                        <TableCell className="font-medium">{invoice.vendor || 'N/A'}</TableCell>
                        <TableCell>{invoice.invoiceDate ? formatInvoiceDate(invoice.invoiceDate) : 'N/A'}</TableCell>
                        <TableCell>
                          {invoice.amount !== undefined && !isNaN(invoice.amount) 
                            ? formatCurrency(invoice.amount, invoice.currency)
                            : 'N/A'}
                        </TableCell>
                        <TableCell>{invoice.category || 'N/A'}</TableCell>
                        <TableCell>{invoice.submittedBy || 'N/A'}</TableCell>
                        <TableCell>{invoice.reviewedBy || 'N/A'}</TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => setSelectedInvoice(invoice)}
                              >
                                <Check className="h-4 w-4" />
                                Approve
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Approve Invoice</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to approve the invoice from {selectedInvoice?.vendor || 'Unknown'} for {selectedInvoice && selectedInvoice.amount !== undefined && !isNaN(selectedInvoice.amount) ? formatCurrency(selectedInvoice.amount, selectedInvoice.currency) : 'N/A'}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    if (selectedInvoice) {
                                      handleApprove(selectedInvoice);
                                    }
                                  }}
                                >
                                  Approve
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ApproveInvoices;
