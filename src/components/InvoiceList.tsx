
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { CalendarIcon, DollarSignIcon, FileTextIcon, CheckIcon, XIcon, AlertTriangle, MessageSquare, ChevronDown, ChevronUp, FileX, ArrowUp, ArrowDown } from "lucide-react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";

interface InvoiceListProps {
  invoices: any[];
  showApprovalStatus?: boolean;
  showSubmittedBy?: boolean;
  isLoading: boolean;
  onRefresh?: () => void;
}

const ITEMS_PER_PAGE = 10;

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
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
    // Fallback formatting if there's an error with Intl.NumberFormat
    return `${currency || "$"}${parseFloat(amount as string).toFixed(2)}`;
  }
};

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd.MM.yyyy");
  } catch (error) {
    return dateString;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "for_review":
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Awaiting Review
        </Badge>
      );
    case "for_approval":
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-600 border-amber-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Awaiting Approval
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-600 border-green-200">
          <CheckIcon className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    case "declined":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-600 border-red-200">
          <XIcon className="w-3 h-3 mr-1" />
          Declined
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
          Unknown
        </Badge>
      );
  }
};

const InvoiceList: React.FC<InvoiceListProps> = ({ 
  invoices, 
  showApprovalStatus = false, 
  showSubmittedBy = false,
  isLoading, 
  onRefresh
}) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  
  const toggleRow = (id: string | number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading invoices...</p>
      </div>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <EmptyPlaceholder
        icon={<FileX className="h-12 w-12 text-muted-foreground" />}
        title="No invoices to display"
        description="There are currently no invoices to display."
        action={onRefresh ? {
          label: "Refresh",
          href: "#",
          onClick: (e) => {
            e.preventDefault();
            onRefresh();
          }
        } : undefined}
      />
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(sortedInvoices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInvoices = sortedInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Reset expanded rows when changing pages
    setExpandedRows({});
  };

  const SortIcon = ({ column }: { column: string }) => {
    const direction = getSortDirection(column);
    if (direction === null) {
      return null;
    }
    return direction === 'asc' ? <ArrowUp size={16} className="ml-1" /> : <ArrowDown size={16} className="ml-1" />;
  };

  return (
    <div className="space-y-4">
      <Card className="w-full overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => requestSort('vendor')} className="cursor-pointer">
                  <div className="flex items-center">
                    Vendor
                    <SortIcon column="vendor" />
                  </div>
                </TableHead>
                <TableHead onClick={() => requestSort('invoiceDate')} className="cursor-pointer">
                  <div className="flex items-center">
                    Invoice Date
                    <SortIcon column="invoiceDate" />
                  </div>
                </TableHead>
                <TableHead onClick={() => requestSort('amount')} className="cursor-pointer">
                  <div className="flex items-center">
                    Amount
                    <SortIcon column="amount" />
                  </div>
                </TableHead>
                <TableHead onClick={() => requestSort('category')} className="cursor-pointer">
                  <div className="flex items-center">
                    Category
                    <SortIcon column="category" />
                  </div>
                </TableHead>
                {showSubmittedBy && (
                  <TableHead onClick={() => requestSort('submittedBy')} className="cursor-pointer">
                    <div className="flex items-center">
                      Submitted By
                      <SortIcon column="submittedBy" />
                    </div>
                  </TableHead>
                )}
                {showApprovalStatus && (
                  <TableHead onClick={() => requestSort('status')} className="cursor-pointer">
                    <div className="flex items-center">
                      Status
                      <SortIcon column="status" />
                    </div>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInvoices.map((invoice) => (
                <React.Fragment key={invoice.id}>
                  <TableRow
                    className={cn(
                      "cursor-pointer",
                      (invoice.review_comment || invoice.approval_comment || invoice.decline_comment) && "border-b-0"
                    )}
                    onClick={() => (invoice.review_comment || invoice.approval_comment || invoice.decline_comment) && toggleRow(invoice.id)}
                  >
                    <TableCell>
                      <div className="flex items-center">
                        <FileTextIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                        {invoice.vendor}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                        {formatDate(invoice.invoiceDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSignIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </div>
                    </TableCell>
                    <TableCell>{invoice.category}</TableCell>
                    {showSubmittedBy && <TableCell>{invoice.submittedBy}</TableCell>}
                    {showApprovalStatus && (
                      <TableCell>
                        <div className="flex items-center justify-between">
                          <StatusBadge status={invoice.status || (invoice.approved ? "approved" : "for_approval")} />
                          
                          {(invoice.review_comment || invoice.approval_comment || invoice.decline_comment) && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRow(invoice.id);
                              }}
                              className="ml-2 p-1 rounded-full hover:bg-gray-100"
                            >
                              {expandedRows[invoice.id] ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                  
                  {(invoice.review_comment || invoice.approval_comment || invoice.decline_comment) && (
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={showSubmittedBy ? 6 : 5} className="p-0">
                        <Collapsible open={expandedRows[invoice.id]}>
                          <CollapsibleContent>
                            <div className="px-4 py-2 space-y-2">
                              {invoice.review_comment && (
                                <div className="flex items-start gap-2 text-sm">
                                  <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                                  <div>
                                    <span className="font-medium text-gray-700">Review Comment:</span>{" "}
                                    <span className="text-gray-600">{invoice.review_comment}</span>
                                  </div>
                                </div>
                              )}
                              {invoice.approval_comment && (
                                <div className="flex items-start gap-2 text-sm">
                                  <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                                  <div>
                                    <span className="font-medium text-gray-700">Approval Comment:</span>{" "}
                                    <span className="text-gray-600">{invoice.approval_comment}</span>
                                  </div>
                                </div>
                              )}
                              {invoice.decline_comment && (
                                <div className="flex items-start gap-2 text-sm">
                                  <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                                  <div>
                                    <span className="font-medium text-gray-700">Decline Reason:</span>{" "}
                                    <span className="text-gray-600">{invoice.decline_comment}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
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
  );
};

export default InvoiceList;
