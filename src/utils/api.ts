
import { toast } from "sonner";

// Function to get the setSessionExpired function from the AuthContext
// This avoids circular dependencies when importing from AuthContext directly
let setSessionExpiredCallback: ((expired: boolean) => void) | null = null;

export const registerSessionExpiredCallback = (callback: (expired: boolean) => void) => {
  setSessionExpiredCallback = callback;
};

export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("smartinvoice_token");
  
  const headers: HeadersInit = {
    "Accept": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper function to handle API responses and check for 403 errors
const handleApiResponse = async (response: Response) => {
  if (response.status === 403) {
    if (setSessionExpiredCallback) {
      setSessionExpiredCallback(true);
    }
    throw new Error("Session expired");
  }
  
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  
  return await response.json();
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
    
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Upload error:", error);
    if (!(error instanceof Error) || error.message !== "Session expired") {
      toast.error("Failed to upload invoice. Please try again.");
    }
    throw error;
  }
};

export const submitInvoice = async (invoiceData: any, canApprove: boolean): Promise<any> => {
  try {
    const response = await fetch("https://n8n.presiyangeorgiev.eu/webhook/smartinvoice/send-invoice", {
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
    
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Submit error:", error);
    if (!(error instanceof Error) || error.message !== "Session expired") {
      toast.error("Failed to submit invoice. Please try again.");
    }
    throw error;
  }
};

export const getInvoicesForApproval = async (username: string): Promise<any> => {
  try {
    const response = await fetch("https://n8n.presiyangeorgiev.eu/webhook/smartinvoice/get-invoices-for-approval", {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Failed to fetch invoices for approval:", error);
    if (!(error instanceof Error) || error.message !== "Session expired") {
      toast.error("Failed to load invoices for approval.");
    }
    throw error;
  }
};

export const approveInvoice = async (invoice: any): Promise<any> => {
  try {
    const username = localStorage.getItem("smartinvoice_user_id") || "";
    
    const response = await fetch("https://n8n.presiyangeorgiev.eu/webhook/smartinvoice/approve-invoice", {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        invoiceId: invoice.id,
      }),
    });
    
    const result = await handleApiResponse(response);
    
    if (result.status === 0) {
      toast.success("Invoice approved successfully.");
    } else if (result.status === -1) {
      toast.error("Failed to approve invoice. The update was not successful.");
      throw new Error("Invoice approval failed");
    }
    
    return result;
  } catch (error) {
    console.error("Failed to approve invoice:", error);
    if (!(error instanceof Error) || error.message !== "Session expired") {
      toast.error("Failed to approve invoice. Please try again.");
    }
    throw error;
  }
};

export const getUserInvoices = async (username: string): Promise<any> => {
  try {
    const response = await fetch("https://n8n.presiyangeorgiev.eu/webhook/smartinvoice/get-user-invoices", {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Failed to fetch user invoices:", error);
    if (!(error instanceof Error) || error.message !== "Session expired") {
      toast.error("Failed to load your submitted invoices.");
    }
    throw error;
  }
};

export const getApprovedInvoices = async (username: string): Promise<any> => {
  try {
    const response = await fetch("https://n8n.presiyangeorgiev.eu/webhook/smartinvoice/get-approved-invoices", {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Failed to fetch approved invoices:", error);
    if (!(error instanceof Error) || error.message !== "Session expired") {
      toast.error("Failed to load approved invoices.");
    }
    throw error;
  }
};

// New function to get invoices for review
export const getInvoicesForReview = async (username: string): Promise<any> => {
  try {
    const response = await fetch("https://n8n.presiyangeorgiev.eu/webhook/smartinvoice/get-invoices-for-review", {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      }
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Failed to fetch invoices for review:", error);
    if (!(error instanceof Error) || error.message !== "Session expired") {
      toast.error("Failed to load invoices for review.");
    }
    throw error;
  }
};

// Function to mark invoice for approval
export const markInvoiceForApproval = async (invoiceId: number): Promise<any> => {
  try {
    const username = localStorage.getItem("smartinvoice_user_id") || "";
    
    const response = await fetch("https://n8n.presiyangeorgiev.eu/webhook/smartinvoice/mark-invoice-for-approval", {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invoiceId
      }),
    });
    
    const result = await handleApiResponse(response);
    
    if (result.status === 0) {
      toast.success("Invoice sent for approval successfully.");
    } else {
      toast.error("Failed to send invoice for approval.");
      throw new Error("Failed to send invoice for approval");
    }
    
    return result;
  } catch (error) {
    console.error("Failed to mark invoice for approval:", error);
    if (!(error instanceof Error) || error.message !== "Session expired") {
      toast.error("Failed to send invoice for approval. Please try again.");
    }
    throw error;
  }
};

// Function to decline invoice
export const declineInvoice = async (invoiceId: number, reason?: string): Promise<any> => {
  try {
    const username = localStorage.getItem("smartinvoice_user_id") || "";
    
    const response = await fetch("https://n8n.presiyangeorgiev.eu/webhook-test/smartinvoice/decline-invoice", {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invoiceId,
        reason: reason || "",
      }),
    });
    
    const result = await handleApiResponse(response);
    
    if (result.status === 0) {
      toast.success("Invoice declined successfully.");
    } else {
      toast.error("Failed to decline invoice.");
      throw new Error("Failed to decline invoice");
    }
    
    return result;
  } catch (error) {
    console.error("Failed to decline invoice:", error);
    if (!(error instanceof Error) || error.message !== "Session expired") {
      toast.error("Failed to decline invoice. Please try again.");
    }
    throw error;
  }
};
