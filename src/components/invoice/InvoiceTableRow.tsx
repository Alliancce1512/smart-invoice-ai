
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { FileTextIcon, CalendarIcon, DollarSignIcon, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface InvoiceTableRowProps {
  invoice: any;
  isExpanded: boolean;
  showSubmittedBy: boolean;
  showReviewedBy: boolean;
  showApprovedBy: boolean;
  showApprovalStatus: boolean;
  toggleExpand: (id: string | number) => void;
  onInvoiceClick?: (invoice: any) => void;
}

const InvoiceTableRow: React.FC<InvoiceTableRowProps> = ({
  invoice,
  isExpanded,
  showSubmittedBy,
  showReviewedBy,
  showApprovedBy,
  showApprovalStatus,
  toggleExpand,
  onInvoiceClick
}) => {
  const hasComments = invoice.review_comment || invoice.approval_comment;
  
  return (
    <TableRow
      className={cn(
        "cursor-pointer hover:bg-gray-50",
        hasComments && "border-b-0"
      )}
      onClick={() => {
        if (onInvoiceClick) {
          onInvoiceClick(invoice);
        } else if (hasComments) {
          toggleExpand(invoice.id);
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
            
            {hasComments && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(invoice.id);
                }}
                className="ml-2 p-1 rounded-full hover:bg-gray-100"
              >
                {isExpanded ? (
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
  );
};

export default InvoiceTableRow;
