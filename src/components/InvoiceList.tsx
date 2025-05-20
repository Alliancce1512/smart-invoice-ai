
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { FileX } from "lucide-react";
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import SortableHeader from "./SortableHeader";
import InvoiceTableRow from "./invoice/InvoiceTableRow";
import InvoiceComments from "./invoice/InvoiceComments";
import InvoicePagination from "./invoice/InvoicePagination";

interface InvoiceListProps {
  invoices: any[];
  showApprovalStatus?: boolean;
  showSubmittedBy?: boolean;
  showApprovedBy?: boolean;
  showReviewedBy?: boolean;
  isLoading: boolean;
  onRefresh?: () => void;
  onInvoiceClick?: (invoice: any) => void;
}

const ITEMS_PER_PAGE = 10;

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
      setSortDirection(sortDirection === "asc" ? "desc" : sortDirection === "desc" ? null : "asc");
      setSortColumn(sortDirection === "desc" ? null : column);
    } else {
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

  const colSpanCount = 
    4 + 
    (showSubmittedBy ? 1 : 0) + 
    (showReviewedBy ? 1 : 0) + 
    (showApprovedBy ? 1 : 0) + 
    (showApprovalStatus ? 1 : 0);

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
                  <SortableHeader
                    sortKey="status"
                    currentSortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  >
                    Status
                  </SortableHeader>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInvoices.map((invoice) => (
                <React.Fragment key={invoice.id}>
                  <InvoiceTableRow
                    invoice={invoice}
                    isExpanded={!!expandedRows[invoice.id]}
                    showSubmittedBy={showSubmittedBy}
                    showReviewedBy={showReviewedBy}
                    showApprovedBy={showApprovedBy}
                    showApprovalStatus={showApprovalStatus}
                    toggleExpand={toggleRow}
                    onInvoiceClick={onInvoiceClick}
                  />
                  
                  {(invoice.review_comment || invoice.approval_comment) && (
                    <InvoiceComments
                      invoice={invoice}
                      isExpanded={!!expandedRows[invoice.id]}
                      colSpan={colSpanCount}
                    />
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <InvoicePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default InvoiceList;
