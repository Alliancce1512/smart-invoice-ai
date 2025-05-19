
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getInvoicesForReview, markInvoiceForApproval, declineInvoice } from "@/utils/api";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, RefreshCw, Edit } from "lucide-react";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import Layout from "@/components/Layout";
import DeclineInvoiceDialog from "@/components/DeclineInvoiceDialog";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import EditInvoiceDialog from "@/components/EditInvoiceDialog";
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
import SortableHeader from "@/components/SortableHeader";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ITEMS_PER_PAGE = 10;

const ReviewInvoices = () => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  
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
  
  let invoices = data?.invoices || [];
  
  // Apply sorting
  if (sortColumn && sortDirection) {
    invoices = [...invoices].sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];
      
      // Handle special cases
      if (sortColumn === "invoiceDate") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (sortColumn === "amount") {
        valA = parseFloat(valA) || 0;
        valB = parseFloat(valB) || 0;
      }
      
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }
  
  // Calculate pagination
  const totalPages = Math.ceil(invoices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInvoices = invoices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction or reset if already sorting by this column
      setSortDirection(sortDirection === "asc" ? "desc" : sortDirection === "desc" ? null : "asc");
      setSortColumn(sortDirection === "desc" ? null : column);
    } else {
      // Start with ascending sort for new column
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  
  const openConfirmDialog = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsConfirmDialogOpen(true);
  };
  
  const handleSendForApproval = async () => {
    if (selectedInvoice) {
      try {
        await markInvoiceForApproval(selectedInvoice.id);
        refetch();
        toast.success("Invoice sent for approval");
        setIsConfirmDialogOpen(false);
        setSelectedInvoice(null);
      } catch (error) {
        toast.error("Error sending invoice for approval");
        console.error("Error sending invoice for approval:", error);
      }
    }
  };
  
  const openEditDialog = (invoice: any) => {
    setSelectedInvoice({...invoice});
    setIsEditDialogOpen(true);
  };
  
  const handleEditAndSend = async (editedInvoice: any) => {
    // First close the dialog to give feedback
    setIsEditDialogOpen(false);
    
    try {
      // The edited invoice still needs to be sent for approval
      await markInvoiceForApproval(editedInvoice.id);
      refetch();
      toast.success("Invoice updated and sent for approval");
    } catch (error) {
      toast.error("Error updating and sending invoice");
      console.error("Error:", error);
    }
    setSelectedInvoice(null);
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Review Invoices</h1>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center gap-2 hover:bg-smartinvoice-soft-gray transition-all duration-300"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        
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
            <Card className="overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableHeader
                        sortKey="vendor"
                        currentSortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                      >
                        Vendor
                      </SortableHeader>
                      <SortableHeader
                        sortKey="invoiceDate"
                        currentSortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                      >
                        Invoice Date
                      </SortableHeader>
                      <SortableHeader
                        sortKey="amount"
                        currentSortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                      >
                        Amount
                      </SortableHeader>
                      <SortableHeader
                        sortKey="category"
                        currentSortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                      >
                        Category
                      </SortableHeader>
                      <SortableHeader
                        sortKey="submittedBy"
                        currentSortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                      >
                        Submitted By
                      </SortableHeader>
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
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    onClick={() => openConfirmDialog(invoice)}
                                    className="bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark text-white transition-all duration-300 shadow-sm hover:shadow-md h-9 w-9"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Send for Approval</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => openEditDialog(invoice)}
                                    className="border-gray-300 hover:bg-smartinvoice-soft-gray transition-all duration-300 h-9 w-9"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit Invoice</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => openDeclineDialog(invoice.id)}
                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-300 h-9 w-9"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Decline Invoice</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
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
          </div>
        )}
      </div>
      
      <DeclineInvoiceDialog
        isOpen={isDeclineDialogOpen}
        onClose={() => setIsDeclineDialogOpen(false)}
        onConfirm={handleDeclineConfirm}
      />
      
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleSendForApproval}
        title="Send Invoice for Approval"
        description={selectedInvoice ? `Are you sure you want to send the invoice from ${selectedInvoice.vendor} for ${formatCurrency(selectedInvoice.amount, selectedInvoice.currency)} for approval? This action cannot be undone.` : "Are you sure you want to send this invoice for approval?"}
        confirmLabel="Send for Approval"
        cancelLabel="Cancel"
      />
      
      <EditInvoiceDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSend={handleEditAndSend}
        invoice={selectedInvoice}
      />
    </Layout>
  );
};

export default ReviewInvoices;
