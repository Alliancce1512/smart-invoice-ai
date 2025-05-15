
import { toast } from "sonner";

export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("smartinvoice_token");
  
  const headers: HeadersInit = {
    "Accept": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    console.log("Using token in headers:", token);
  } else {
    console.warn("No auth token found in localStorage");
  }
  
  return headers;
};

export const uploadInvoice = async (file: File, sessionId: string): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("invoice_file", file);
    formData.append("sessionId", sessionId);
    
    // Don't include token in FormData as headers already contain it
    
    const headers = getAuthHeaders();
    console.log("Request headers:", headers);
    
    const response = await fetch("https://n8n.presiyangeorgiev.eu/webhook-test/smartinvoice/upload", {
      method: "POST",
      headers: headers,
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${await response.text()}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Upload error:", error);
    toast.error("Failed to upload invoice. Please try again.");
    throw error;
  }
};
