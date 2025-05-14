
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const FileUploader = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }, []);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    
    if (!validTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or image file (JPEG, PNG)",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
  };

  const closeErrorDialog = () => {
    setError(null);
  };

  const uploadFile = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('invoice_file', file);
      
      // Send POST request to the webhook
      const response = await fetch('https://n8n.presiyangeorgiev.eu/webhook-test/smartinvoice/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Parse the JSON response
      const data = await response.json();
      
      // Check if the response contains an error
      if (data.error) {
        setError(data.error || 'An error occurred while processing the invoice');
        return;
      }

      // Store data in session storage to access on result page
      sessionStorage.setItem("invoiceData", JSON.stringify(data));
      
      toast({
        title: "Upload successful",
        description: "Your invoice has been processed"
      });
      
      // Navigate to the results page
      navigate("/results");
    } catch (error) {
      console.error('Upload error:', error);
      setError('There was an error processing your invoice. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto">
        <div 
          className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors duration-200 ${
            isDragging 
              ? "border-smartinvoice-purple bg-smartinvoice-purple/5" 
              : "border-gray-300 hover:border-smartinvoice-purple"
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-12 w-12 mx-auto mb-4 text-smartinvoice-purple"
          >
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
            <path d="M12 12v9"></path>
            <path d="m8 17 4 4 4-4"></path>
          </svg>
          
          <h3 className="text-lg font-medium mb-2">
            {file ? file.name : "Drag your invoice here or click to browse"}
          </h3>
          
          <p className="text-sm text-gray-500 mb-4">
            {file 
              ? `${(file.size / (1024 * 1024)).toFixed(2)} MB - ${file.type}` 
              : "Support for PDF, JPG, PNG files"}
          </p>

          <input 
            id="fileInput"
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={onFileInputChange}
          />

          {!file ? (
            <label
              htmlFor="fileInput"
              className="btn-primary hover-scale inline-block cursor-pointer"
            >
              Browse Files
            </label>
          ) : (
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => setFile(null)}
                className="btn-secondary"
                disabled={isUploading}
              >
                Change File
              </button>
              <button
                onClick={uploadFile}
                className="btn-primary hover-scale"
                disabled={isUploading}
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Process Invoice"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <AlertDialog open={!!error} onOpenChange={closeErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error Processing Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={closeErrorDialog}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FileUploader;
