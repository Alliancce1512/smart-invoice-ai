
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getInvoicesForReview, markInvoiceForApproval, declineInvoice, updateInvoice } from "@/utils/api";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, RefreshCw, Edit } from "lucide-react";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import Layout from "@/components/Layout";
import DeclineInvoiceDialog from "@/components/DeclineInvoiceDialog";
import ApprovalConfirmationDialog from "@/components/ApprovalConfirmationDialog";
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

const ITEMS_PER_PAGE = 10;

const ReviewInvoices = () => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  
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
  
  // Sorting logic
  const sortedInvoices = React.useMemo(() => {
    let sortableItems = [...invoices];
    
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        // Handle different data types
        if (sortConfig.key === 'amount') {
          const aNum = parseFloat(aValue);
          const bNum = parseFloat(bValue);
          return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
        } else if (sortConfig.key === 'invoiceDate') {
          const aDate = new Date(aValue).getTime();
          const bDate = new Date(bValue).getTime();
          return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
        } else {
          // String comparison
          if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
        }
        return 0;
      });
    }
    
    return sortableItems;
  }, [invoices, sortConfig]);
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedInvoices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInvoices = sortedInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };
  
  const getSortDirection = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction;
  };
  
  const SortIcon = ({ column }: { column: string }) => {
    const direction = getSortDirection(column);
    if (!direction) return null;
    
    return direction === 'asc' ? 
      <span className="ml-1">▲</span> : 
      <span className="ml-1">▼</span>;
  };
  
  const openApprovalConfirmation = (invoiceId: number) => {
    setSelectedInvoiceId(invoiceId);
    setIsApprovalDialogOpen(true);
  };
  
  const handleSendForApproval = async () => {
    if (selectedInvoiceId) {
      try {
        await markInvoiceForApproval(selectedInvoiceId);
        refetch();
        toast.success("Invoice sent for approval");
        setIsApprovalDialogOpen(false);
      } catch (error) {
        toast.error("Error sending invoice for approval");
        console.error("Error sending invoice for approval:", error);
      }
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
  
  const openEditDialog = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsEditDialogOpen(true);
  };
  
  const handleEditAndApprove = async (updatedInvoice: any) => {
    try {
      // First update the invoice
      await updateInvoice(updatedInvoice.id, updatedInvoice);
      
      // Then mark it for approval
      await markInvoiceForApproval(updatedInvoice.id);
      
      refetch();
      toast.success("Invoice updated and sent for approval");
      setIsEditDialogOpen(false);
      setSelectedInvoice(null);
    } catch (error) {
      toast.error("Error updating invoice");
      console.error("Error updating invoice:", error);
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
            className="flex items-center gap-2"
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
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        onClick={() => requestSort('vendor')} 
                        className="cursor-pointer"
                      >
                        <div className="flex items-center">
                          Vendor
                          <SortIcon column="vendor" />
                        </div>
                      </TableHead>
                      <TableHead 
                        onClick={() => requestSort('invoiceDate')} 
                        className="cursor-pointer"
                      >
                        <div className="flex items-center">
                          Invoice Date
                          <SortIcon column="invoiceDate" />
                        </div>
                      </TableHead>
                      <TableHead 
                        onClick={() => requestSort('amount')} 
                        className="cursor-pointer"
                      >
                        <div className="flex items-center">
                          Amount
                          <SortIcon column="amount" />
                        </div>
                      </TableHead>
                      <TableHead 
                        onClick={() => requestSort('category')} 
                        className="cursor-pointer"
                      >
                        <div className="flex items-center">
                          Category
                          <SortIcon column="category" />
                        </div>
                      </TableHead>
                      <TableHead 
                        onClick={() => requestSort('submittedBy')} 
                        className="cursor-pointer"
                      >
                        <div className="flex items-center">
                          Submitted By
                          <SortIcon column="submittedBy" />
                        </div>
                      </TableHead>
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
                              variant="outline"
                              onClick={() => openEditDialog(invoice)}
                              className="border-gray-300 hover:bg-gray-50"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => openApprovalConfirmation(invoice.id)}
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
          </div>
        )}
      </div>
      
      <DeclineInvoiceDialog
        isOpen={isDeclineDialogOpen}
        onClose={() => setIsDeclineDialogOpen(false)}
        onConfirm={handleDeclineConfirm}
      />
      
      <ApprovalConfirmationDialog
        isOpen={isApprovalDialogOpen}
        onClose={() => setIsApprovalDialogOpen(false)}
        onConfirm={handleSendForApproval}
      />
      
      {selectedInvoice && (
        <EditInvoiceDialog
          invoice={selectedInvoice}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedInvoice(null);
          }}
          onSendForApproval={handleEditAndApprove}
        />
      )}
    </Layout>
  );
};

export default ReviewInvoices;
