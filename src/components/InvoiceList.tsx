import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { CalendarIcon, DollarSignIcon, FileTextIcon, CheckIcon, XIcon, AlertTriangle, MessageSquare, ChevronDown, ChevronUp, FileX } from "lucide-react";
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
import SortableHeader from "./SortableHeader";

interface InvoiceListProps {
  invoices: any[];
  showApprovalStatus?: boolean;
  showSubmittedBy?: boolean;
  showApprovedBy?: boolean;  // New prop for "Approved By" column
  showReviewedBy?: boolean;  // New prop for "Reviewed By" column
  isLoading: boolean;
  onRefresh?: () => void;
  onInvoiceClick?: (invoice: any) => void; // New prop for handling invoice clicks
}

const ITEMS_PER_PAGE = 10;

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
  showApprovedBy = false,
  showReviewedBy = false,
  isLoading, 
  onRefresh,
  onInvoiceClick
}) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  
  const toggleRow = (id: string | number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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
  
  // Apply sorting to data
  const sortedInvoices = React.useMemo(() => {
    const result = [...invoices];
    if (sortColumn && sortDirection) {
      result.sort((a, b) => {
        let valA = a[sortColumn];
        let valB = b[sortColumn];
        
        // Handle special cases like dates and amounts
        if (sortColumn === "invoiceDate") {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        } else if (sortColumn === "amount") {
          valA = parseFloat(valA) || 0;
          valB = parseFloat(valB) || 0;
        } else if (sortColumn === "status") {
          valA = a.status || (a.approved ? "approved" : a.declined ? "declined" : "for_approval");
          valB = b.status || (b.approved ? "approved" : b.declined ? "declined" : "for_approval");
        }
        
        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [invoices, sortColumn, sortDirection]);
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedInvoices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInvoices = sortedInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Reset expanded rows when changing pages
    setExpandedRows({});
  };

  // This useEffect hook will always run, not conditionally
  useEffect(() => {
    if (!paginatedInvoices || paginatedInvoices.length === 0) return;
    
    const newExpandedRows: Record<string, boolean> = {};
    paginatedInvoices.forEach(invoice => {
      if ((invoice.status === "declined" || invoice.approved === false) && 
          (invoice.review_comment || invoice.approval_comment)) {
        newExpandedRows[invoice.id] = true;
      }
    });
    setExpandedRows(prev => ({...prev, ...newExpandedRows}));
  }, [paginatedInvoices, currentPage]);

  const handleRowClick = (invoice: any) => {
    if (onInvoiceClick) {
      onInvoiceClick(invoice);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading invoices...</p>
      </div>
    );
  }

  if (!sortedInvoices || sortedInvoices.length === 0) {
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

  return (
    <div className="space-y-4">
      <Card className="w-full overflow-hidden">
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
                {showSubmittedBy && (
                  <SortableHeader
                    sortKey="submittedBy"
                    currentSortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  >
                    Submitted By
                  </SortableHeader>
                )}
                {showReviewedBy && (
                  <SortableHeader
                    sortKey="reviewedBy"
                    currentSortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  >
                    Reviewed By
                  </SortableHeader>
                )}
                {showApprovedBy && (
                  <SortableHeader
                    sortKey="approvedBy"
                    currentSortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  >
                    Approved By
                  </SortableHeader>
                )}
                {showApprovalStatus && (
                  <TableHead>Status</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInvoices.map((invoice) => (
                <React.Fragment key={invoice.id}>
                  <TableRow
                    className={cn(
                      "cursor-pointer hover:bg-gray-50",
                      (invoice.review_comment || invoice.approval_comment) && "border-b-0"
                    )}
                    onClick={() => {
                      if (onInvoiceClick) {
                        handleRowClick(invoice);
                      } else if ((invoice.review_comment || invoice.approval_comment)) {
                        toggleRow(invoice.id);
                      }
                    }}
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
                    {showReviewedBy && <TableCell>{invoice.reviewedBy || 'N/A'}</TableCell>}
                    {showApprovedBy && <TableCell>{invoice.approvedBy || 'N/A'}</TableCell>}
                    {showApprovalStatus && (
                      <TableCell>
                        <div className="flex items-center justify-between">
                          <StatusBadge status={invoice.status || (invoice.approved ? "approved" : invoice.declined ? "declined" : "for_approval")} />
                          
                          {(invoice.review_comment || invoice.approval_comment) && (
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
                  
                  {(invoice.review_comment || invoice.approval_comment) && (
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={showSubmittedBy && (showApprovedBy || showReviewedBy) ? 7 : (showSubmittedBy || showApprovedBy || showReviewedBy) ? 6 : 5} className="p-0">
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
