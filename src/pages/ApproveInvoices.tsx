
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";

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
}

const ApproveInvoices = () => {
  const { userId } = useAuth();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  const fetchInvoices = async (): Promise<Invoice[]> => {
    try {
      const response = await fetch("https://n8n.presiyangeorgiev.eu/webhook/smartinvoice/get-invoices-for-approval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userId,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
      toast.error("Failed to load invoices for approval.");
      return [];
    }
  };

  const { data: invoices, isLoading, isError, refetch } = useQuery({
    queryKey: ["invoicesForApproval"],
    queryFn: fetchInvoices,
  });

  const approveInvoice = async (invoice: Invoice) => {
    try {
      const response = await fetch("https://n8n.presiyangeorgiev.eu/webhook-test/smartinvoice/send-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...invoice,
          approved: true,
          submittedBy: invoice.submittedBy,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      toast.success("Invoice approved successfully.");
      refetch();
    } catch (error) {
      console.error("Failed to approve invoice:", error);
      toast.error("Failed to approve invoice. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };
  
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Approve Invoices</h1>
            <p className="text-muted-foreground mt-1">
              Review and approve pending invoices
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => refetch()} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading invoices...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-8">
            <p className="text-red-500">Error loading invoices. Please try again.</p>
          </div>
        ) : invoices && invoices.length > 0 ? (
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Pending Invoices</CardTitle>
              <CardDescription>
                You have {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} waiting for approval
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead className="w-[100px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.vendor}</TableCell>
                        <TableCell>{invoice.invoiceDate}</TableCell>
                        <TableCell>{formatCurrency(invoice.amount, invoice.currency)}</TableCell>
                        <TableCell>{invoice.category}</TableCell>
                        <TableCell>{invoice.submittedBy}</TableCell>
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
                                  Are you sure you want to approve the invoice from {selectedInvoice?.vendor} for {selectedInvoice ? formatCurrency(selectedInvoice.amount, selectedInvoice.currency) : ''}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    if (selectedInvoice) {
                                      approveInvoice(selectedInvoice);
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
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Pending Invoices</CardTitle>
              <CardDescription>
                There are currently no invoices waiting for your approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All invoices have been processed. Check back later for new submissions.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => refetch()}>Refresh</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ApproveInvoices;
