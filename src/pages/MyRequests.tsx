
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserInvoices } from "@/utils/api";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import InvoiceList from "@/components/InvoiceList";
import { useAuth } from "@/contexts/AuthContext";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import InvoiceDetailsDialog from "@/components/InvoiceDetailsDialog";

const MyRequests: React.FC = () => {
  const { userId } = useAuth();
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["user-invoices", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID not found");
      }
      const response = await getUserInvoices(userId);
      if (response.status === -1) {
        throw new Error("Failed to fetch invoices");
      }
      return response;
    },
    enabled: !!userId,
  });

  React.useEffect(() => {
    if (error) {
      toast.error("Failed to load your invoices");
      console.error(error);
    }
  }, [error]);

  const invoices = data?.invoices || [];

  const handleRefresh = () => {
    refetch();
    toast.info("Refreshing invoices...");
  };

  const handleInvoiceClick = (invoice: any) => {
    setSelectedInvoice(invoice);
  };

  const handleCloseDialog = () => {
    setSelectedInvoice(null);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">My Requests</h1>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        
        <InvoiceList 
          invoices={invoices} 
          showApprovalStatus={true}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onInvoiceClick={handleInvoiceClick}
        />

        {selectedInvoice && (
          <InvoiceDetailsDialog 
            invoice={selectedInvoice} 
            isOpen={!!selectedInvoice} 
            onClose={handleCloseDialog} 
          />
        )}
      </div>
    </Layout>
  );
};

export default MyRequests;
