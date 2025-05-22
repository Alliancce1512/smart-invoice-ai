
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export interface SuccessMessage {
  vendor: string;
  action: 'submitted' | 'approved';
}

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  successMessage: SuccessMessage | null;
  onProcessAnother: () => void;
}

export const SuccessDialog: React.FC<SuccessDialogProps> = ({
  open,
  onOpenChange,
  successMessage,
  onProcessAnother,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700 shadow-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 dark:text-white">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <span>Invoice {successMessage?.action === 'approved' ? 'Approved' : 'Submitted'} Successfully</span>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-600 dark:text-gray-300">
            The invoice for <span className="font-semibold dark:text-white">{successMessage?.vendor || 'vendor'}</span> has been {successMessage?.action === 'approved' ? 'approved and saved' : 'submitted for approval'}.
          </p>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button 
            onClick={onProcessAnother} 
            className="bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark"
          >
            Process Another Invoice
          </Button>
          <Button 
            onClick={() => onOpenChange(false)} 
            variant="outline"
            className="dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
