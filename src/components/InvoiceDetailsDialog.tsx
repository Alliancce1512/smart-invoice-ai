
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import { Button } from "./ui/button";

interface InvoiceDetailsDialogProps {
  invoice: any;
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Not available";
  try {
    return format(parseISO(dateString), "dd.MM.yyyy");
  } catch (error) {
    return dateString || "Not available";
  }
};

const formatDateTime = (dateString: string | null) => {
  if (!dateString) return "Not available";
  try {
    return format(parseISO(dateString), "dd.MM.yyyy HH:mm");
  } catch (error) {
    return dateString || "Not available";
  }
};

const InvoiceDetailsDialog: React.FC<InvoiceDetailsDialogProps> = ({
  invoice,
  isOpen,
  onClose,
}) => {
  if (!invoice) return null;

  const formatCurrency = (amount: string | number, currency: string = "USD") => {
    if (!amount) return "Not available";
    
    try {
      const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
      if (isNaN(numericAmount)) return "Not available";
      
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
      }).format(numericAmount);
    } catch (error) {
      return `${currency || "$"}${parseFloat(amount as string).toFixed(2)}`;
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "for_review":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            Awaiting Review
          </span>
        );
      case "for_approval":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
            Awaiting Approval
          </span>
        );
      case "approved":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Approved
          </span>
        );
      case "declined":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            Declined
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {status || "Unknown"}
          </span>
        );
    }
  };

  const renderFieldRow = (label: string, value: React.ReactNode, highlight: boolean = false) => (
    <div className={`py-3 ${highlight ? "bg-gray-50" : ""} border-b border-gray-100`}>
      <div className="grid grid-cols-3 gap-4">
        <dt className="text-sm font-medium text-gray-600 pl-4">{label}</dt>
        <dd className="text-sm text-gray-900 col-span-2">{value}</dd>
      </div>
    </div>
  );

  const hasReviewInfo = invoice.reviewedBy || invoice.reviewedAt || invoice.reviewComment;
  const hasApprovalInfo = invoice.approvedBy || invoice.approvedAt || invoice.approvalComment;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Invoice Details</DialogTitle>
          <DialogDescription className="text-base">
            {invoice.vendor} - {formatDate(invoice.invoiceDate)}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh] rounded-md border border-gray-200">
          <dl className="divide-y divide-gray-100 bg-white">
            {renderFieldRow("Vendor", invoice.vendor, true)}
            {renderFieldRow("Invoice Date", formatDate(invoice.invoiceDate))}
            {renderFieldRow("Amount", formatCurrency(invoice.amount, invoice.currency), true)}
            {renderFieldRow("IBAN", invoice.iban || "Not available")}
            {renderFieldRow("Category", invoice.category, true)}
            {renderFieldRow("Status", renderStatusBadge(invoice.status), false)}
            
            {renderFieldRow("Submitted By", invoice.submittedBy || "Not available", true)}
            {renderFieldRow("Submitted At", formatDateTime(invoice.submittedAt))}
            
            {hasReviewInfo && (
              <>
                {renderFieldRow("Reviewed By", invoice.reviewedBy || "Not available", true)}
                {renderFieldRow("Reviewed At", formatDateTime(invoice.reviewedAt))}
                {renderFieldRow("Review Comment", invoice.reviewComment || "Not available")}
              </>
            )}
            
            {hasApprovalInfo && (
              <>
                {renderFieldRow("Approved By", invoice.approvedBy || "Not available", true)}
                {renderFieldRow("Approved At", formatDateTime(invoice.approvedAt))}
                {renderFieldRow("Approval Comment", invoice.approvalComment || "Not available")}
              </>
            )}
          </dl>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetailsDialog;
