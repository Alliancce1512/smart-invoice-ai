
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
