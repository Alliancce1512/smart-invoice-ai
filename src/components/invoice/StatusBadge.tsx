
import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckIcon, XIcon } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "for_review":
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Awaiting Review
        </Badge>
      );
    case "for_approval":
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-600 border-amber-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Awaiting Approval
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-600 border-green-200">
          <CheckIcon className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    case "declined":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-600 border-red-200">
          <XIcon className="w-3 h-3 mr-1" />
          Declined
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
          Unknown
        </Badge>
      );
  }
};

export default StatusBadge;
