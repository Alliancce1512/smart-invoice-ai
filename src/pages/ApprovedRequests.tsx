
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getApprovedInvoices } from "@/utils/api";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import InvoiceList from "@/components/InvoiceList";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ApprovedRequests: React.FC = () => {
  const { userId, accessConfig } = useAuth();
  
  // Redirect if user doesn't have permission
  if (!accessConfig?.canApproveInvoices) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/" />;
  }
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["approved-invoices", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID not found");
      }
      const response = await getApprovedInvoices(userId);
      if (response.status === -1) {
        throw new Error("Failed to fetch approved invoices");
      }
      return response;
    },
    enabled: !!userId && !!accessConfig?.canApproveInvoices,
  });

  React.useEffect(() => {
    if (error) {
      toast.error("Failed to load approved invoices");
      console.error(error);
    }
  }, [error]);

  const invoices = data?.invoices || [];

  const handleRefresh = () => {
    refetch();
    toast.info("Refreshing approved invoices...");
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Approved Invoices</h1>
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
          showSubmittedBy={true}
          showApprovedBy={true}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          showApprovalStatus={true}
        />
      </div>
    </Layout>
  );
};

export default ApprovedRequests;
