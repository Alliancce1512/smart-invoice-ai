
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getApprovedInvoices } from "@/utils/api";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import InvoiceList from "@/components/InvoiceList";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import { CheckCircle } from "lucide-react";

const ApprovedRequests: React.FC = () => {
  const { userId, accessConfig } = useAuth();
  
  // Redirect if user doesn't have permission
  if (!accessConfig?.canApproveInvoices) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/" />;
  }
  
  const { data, isLoading, error } = useQuery({
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

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-semibold mb-6">Approved Invoices</h1>
        
        {invoices.length === 0 && !isLoading ? (
          <EmptyPlaceholder
            icon={<CheckCircle className="h-12 w-12 text-muted-foreground" />}
            title="No approved invoices"
            description="There are no approved invoices yet."
          />
        ) : (
          <InvoiceList 
            invoices={invoices} 
            isLoading={isLoading} 
          />
        )}
      </div>
    </Layout>
  );
};

export default ApprovedRequests;
