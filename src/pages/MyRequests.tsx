
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserInvoices } from "@/utils/api";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import InvoiceList from "@/components/InvoiceList";
import { useAuth } from "@/contexts/AuthContext";

const MyRequests: React.FC = () => {
  const { userId } = useAuth();
  
  const { data, isLoading, error } = useQuery({
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

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-semibold mb-6">My Submitted Invoices</h1>
        <InvoiceList 
          invoices={invoices} 
          showApprovalStatus={true}
          isLoading={isLoading} 
        />
      </div>
    </Layout>
  );
};

export default MyRequests;
