
import React from "react";
import { MessageSquare } from "lucide-react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { TableCell, TableRow } from "@/components/ui/table";

interface InvoiceCommentsProps {
  invoice: any;
  isExpanded: boolean;
  colSpan: number;
}

const InvoiceComments: React.FC<InvoiceCommentsProps> = ({
  invoice,
  isExpanded,
  colSpan
}) => {
  return (
    <TableRow className="bg-gray-50">
      <TableCell colSpan={colSpan} className="p-0">
        <Collapsible open={isExpanded}>
          <CollapsibleContent>
            <div className="px-4 py-2 space-y-2">
              {invoice.review_comment && (
                <div className="flex items-start gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-700">Review Comment:</span>{" "}
                    <span className="text-gray-600">{invoice.review_comment}</span>
                  </div>
                </div>
              )}
              {invoice.approval_comment && (
                <div className="flex items-start gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-700">Approval Comment:</span>{" "}
                    <span className="text-gray-600">{invoice.approval_comment}</span>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </TableCell>
    </TableRow>
  );
};

export default InvoiceComments;
