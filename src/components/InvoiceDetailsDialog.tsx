
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface InvoiceDetailsDialogProps {
  invoice: any;
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Not available";
  try {
    return format(new Date(dateString), "dd.MM.yyyy");
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

  const renderFieldRow = (label: string, value: React.ReactNode, highlight: boolean = false) => (
    <div className={`py-3 ${highlight ? "bg-gray-50" : ""} border-b border-gray-100`}>
      <div className="grid grid-cols-3 gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="text-sm text-gray-900 col-span-2">{value}</dd>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex justify-between items-center">
            <span>Invoice Details</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogTitle>
          <DialogDescription className="text-base">
            {invoice.vendor} - {formatDate(invoice.invoiceDate)}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh]">
          <dl className="divide-y divide-gray-100">
            {renderFieldRow("Vendor", invoice.vendor, true)}
            {renderFieldRow("Invoice Date", formatDate(invoice.invoiceDate))}
            {renderFieldRow("Amount", formatCurrency(invoice.amount, invoice.currency), true)}
            {renderFieldRow("IBAN", invoice.iban || "Not available")}
            {renderFieldRow("Category", invoice.category, true)}
            {renderFieldRow("Status", 
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                invoice.status === "approved" ? "bg-green-100 text-green-800" :
                invoice.status === "declined" ? "bg-red-100 text-red-800" :
                invoice.status === "for_approval" ? "bg-amber-100 text-amber-800" :
                "bg-gray-100 text-gray-800"
              }`}>
                {invoice.status}
              </span>
            )}
            
            {renderFieldRow("Submitted By", invoice.submittedBy || "Not available", true)}
            {renderFieldRow("Submitted At", formatDate(invoice.submittedAt))}
            
            {renderFieldRow("Reviewed By", invoice.reviewedBy || "Not available", true)}
            {renderFieldRow("Reviewed At", formatDate(invoice.reviewedAt))}
            {renderFieldRow("Review Comment", invoice.reviewComment || "Not available")}
            
            {renderFieldRow("Approved By", invoice.approvedBy || "Not available", true)}
            {renderFieldRow("Approved At", formatDate(invoice.approvedAt))}
            {renderFieldRow("Approval Comment", invoice.approvalComment || "Not available")}
            
            {renderFieldRow("Edited", invoice.edited ? "Yes" : "No", true)}
            {renderFieldRow("Last Edited By", invoice.lastEditedBy || "Not available")}
          </dl>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetailsDialog;
