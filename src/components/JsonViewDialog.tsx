
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileJson } from "lucide-react";

interface JsonViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const JsonViewDialog: React.FC<JsonViewDialogProps> = ({ isOpen, onClose, data }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] bg-white dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader className="space-y-3 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-smartinvoice-soft-gray dark:bg-gray-700">
              <FileJson className="h-5 w-5 text-smartinvoice-purple" />
            </div>
            <DialogTitle className="text-xl">Raw JSON Data</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Raw extracted data from the invoice
          </p>
        </DialogHeader>

        <div className="overflow-auto max-h-[60vh] font-mono text-sm p-4 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <pre>{data ? JSON.stringify(data, null, 2) : "No data available"}</pre>
        </div>

        <DialogFooter>
          <Button 
            onClick={onClose}
            className="bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark transition-all duration-300"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JsonViewDialog;
