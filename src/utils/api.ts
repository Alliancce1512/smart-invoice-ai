
import { toast } from "sonner";

export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("smartinvoice_token");
  
  const headers: HeadersInit = {
    "Accept": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log(token);
  
  return headers;
};

export const uploadInvoice = async (file: File, sessionId: string): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("invoice_file", file);
    formData.append("sessionId", sessionId);
    
    const response = await fetch("https://n8n.presiyangeorgiev.eu/webhook/smartinvoice/upload", {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Upload error:", error);
    toast.error("Failed to upload invoice. Please try again.");
    throw error;
  }
};

export const submitInvoice = async (invoiceData: any, canApprove: boolean): Promise<any> => {
  try {
    const response = await fetch("https://n8n.presiyangeorgiev.eu/webhook-test/smartinvoice/send-invoice", {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...invoiceData,
        approved: canApprove || false,
        submittedBy: localStorage.getItem("smartinvoice_user_id") || "unknown_user"
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Submit error:", error);
    toast.error("Failed to submit invoice. Please try again.");
    throw error;
  }
};

export const getInvoicesForApproval = async (username: string): Promise<any[]> => {
  try {
    const response = await fetch("https://n8n.presiyangeorgiev.eu/webhook/smartinvoice/get-invoices-for-approval", {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch invoices for approval:", error);
    toast.error("Failed to load invoices for approval.");
    throw error;
  }
};

export const approveInvoice = async (invoice: any): Promise<any> => {
  try {
    const response = await fetch("https://n8n.presiyangeorgiev.eu/webhook-test/smartinvoice/send-invoice", {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
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
    
    return await response.json();
  } catch (error) {
    console.error("Failed to approve invoice:", error);
    toast.error("Failed to approve invoice. Please try again.");
    throw error;
  }
};
