
import React from "react";
import { Card } from "@/components/ui/card";
import { CalendarIcon, DollarSignIcon, FileTextIcon, CheckIcon, XIcon } from "lucide-react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface InvoiceListProps {
  invoices: any[];
  showApprovalStatus?: boolean;
  isLoading: boolean;
}

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
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch (error) {
    return dateString;
  }
};

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, showApprovalStatus = false, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading invoices...</p>
      </div>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">No invoices found.</p>
      </div>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Category</TableHead>
              {showApprovalStatus && <TableHead>Approval</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
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
                {showApprovalStatus && (
                  <TableCell>
                    {invoice.approved ? (
                      <div className="flex items-center text-green-600">
                        <CheckIcon className="w-4 h-4 mr-1" />
                        Approved
                      </div>
                    ) : (
                      <div className="flex items-center text-amber-600">
                        <XIcon className="w-4 h-4 mr-1" />
                        Pending
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default InvoiceList;
