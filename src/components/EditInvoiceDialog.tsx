
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (invoice: any) => void;
  invoice: any;
}

const EditInvoiceDialog: React.FC<EditInvoiceDialogProps> = ({
  isOpen,
  onClose,
  onSend,
  invoice,
}) => {
  const [editedInvoice, setEditedInvoice] = useState<any>({});
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Initialize the editedInvoice and date when the invoice prop changes
  useEffect(() => {
    if (invoice) {
      setEditedInvoice({ ...invoice });
      setDate(invoice.invoiceDate ? new Date(invoice.invoiceDate) : undefined);
    } else {
      // Set default values when invoice is null
      setEditedInvoice({});
      setDate(undefined);
    }
  }, [invoice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedInvoice(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      setEditedInvoice(prev => ({
        ...prev,
        invoiceDate: format(date, "yyyy-MM-dd"),
      }));
    }
  };

  const handleSend = () => {
    onSend(editedInvoice);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader className="space-y-3 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-smartinvoice-soft-gray dark:bg-gray-700">
              <FileText className="h-5 w-5 text-smartinvoice-purple" />
            </div>
            <DialogTitle className="text-xl">Edit Invoice</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Make changes to the invoice details before sending for approval.
          </p>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vendor" className="text-right font-medium text-gray-700 dark:text-gray-300">
              Vendor
            </Label>
            <Input
              id="vendor"
              name="vendor"
              value={editedInvoice?.vendor || ""}
              onChange={handleInputChange}
              className="col-span-3 border-gray-300 focus:border-smartinvoice-purple focus:ring focus:ring-smartinvoice-purple/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="invoiceDate" className="text-right font-medium text-gray-700 dark:text-gray-300">
              Invoice Date
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal border-gray-300 hover:bg-smartinvoice-soft-gray dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right font-medium text-gray-700 dark:text-gray-300">
              Amount
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              value={editedInvoice?.amount || ""}
              onChange={handleInputChange}
              className="col-span-2 border-gray-300 focus:border-smartinvoice-purple focus:ring focus:ring-smartinvoice-purple/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <Input
              id="currency"
              name="currency"
              value={editedInvoice?.currency || "USD"}
              onChange={handleInputChange}
              className="col-span-1 border-gray-300 focus:border-smartinvoice-purple focus:ring focus:ring-smartinvoice-purple/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Currency"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right font-medium text-gray-700 dark:text-gray-300">
              Category
            </Label>
            <Input
              id="category"
              name="category"
              value={editedInvoice?.category || ""}
              onChange={handleInputChange}
              className="col-span-3 border-gray-300 focus:border-smartinvoice-purple focus:ring focus:ring-smartinvoice-purple/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <DialogFooter className="gap-2 pt-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSend} 
            className="bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Send for Approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditInvoiceDialog;
