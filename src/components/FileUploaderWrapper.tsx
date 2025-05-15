
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import FileUploader from "./FileUploader";
import { uploadInvoice } from "@/utils/api";
import { v4 as uuidv4 } from "uuid";

const FileUploaderWrapper: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Generate a new session ID when the component mounts
    setSessionId(uuidv4());
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    
    try {
      // Clear any previous invoice data from session storage
      sessionStorage.removeItem("invoiceData");
      
      const data = await uploadInvoice(file, sessionId);
      
      // Store the invoice data in session storage
      sessionStorage.setItem("invoiceData", JSON.stringify(data));
      
      // Navigate to the results page
      navigate("/results");
      
      toast.success("Invoice uploaded successfully!");
    } catch (error) {
      console.error("Error uploading invoice:", error);
      toast.error("Failed to upload invoice. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FileUploader 
      onFileUpload={handleFileUpload}
      isUploading={isUploading}
    />
  );
};

export default FileUploaderWrapper;
