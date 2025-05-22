import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { FileUp, FileText, ListChecks, Check, CheckCheck } from "lucide-react";
import ActionCard from "./ActionCard";

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { accessConfig } = useAuth();
  
  // Action card data with role-based filtering applied later
  const actionCards = [
    {
      icon: <FileUp className="h-6 w-6 text-smartinvoice-purple" />,
      title: "Upload Your Next Invoice",
      description: "Quickly upload and process your invoice using our AI-powered system",
      buttonText: "Upload Now",
      buttonVariant: "default" as const,
      onClick: () => navigate("/upload"),
      requiredRole: null, // Available to all
    },
    {
      icon: <FileText className="h-6 w-6 text-smartinvoice-purple" />,
      title: "Check Latest Status",
      description: "Track and view the current status of all your submitted invoices",
      buttonText: "View Invoices",
      onClick: () => navigate("/requests"),
      requiredRole: null, // Available to all
    },
    {
      icon: <ListChecks className="h-6 w-6 text-smartinvoice-purple" />,
      title: "Review Pending Invoices",
      description: "Start reviewing submitted invoices and send them for approval",
      buttonText: "Start Reviewing",
      onClick: () => navigate("/review"),
      requiredRole: "canReviewInvoices",
    },
    {
      icon: <Check className="h-6 w-6 text-smartinvoice-purple" />,
      title: "Approve Pending Invoices",
      description: "Review and provide final approval for pending invoices",
      buttonText: "Start Approving",
      onClick: () => navigate("/approve"),
      requiredRole: "canApproveInvoices",
    },
    {
      icon: <CheckCheck className="h-6 w-6 text-smartinvoice-purple" />,
      title: "View Approved Invoices",
      description: "Access all approved invoices and their details",
      buttonText: "View Approved",
      onClick: () => navigate("/approved"),
      requiredRole: null, // Available to all
    }
  ];
  
  // Filter action cards based on user permissions
  const filteredActionCards = actionCards.filter(card => {
    if (card.requiredRole === null) return true;
    if (card.requiredRole === "canReviewInvoices" && accessConfig?.canReviewInvoices) return true;
    if (card.requiredRole === "canApproveInvoices" && accessConfig?.canApproveInvoices) return true;
    return false;
  });
  
  return (
    <div className="relative px-4 sm:px-6 -mx-4 sm:mx-0">
      <div className="py-4 overflow-x-auto scrollbar-hide">
        <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-5 overflow-visible">
          {filteredActionCards.map((card, index) => (
            <div key={index} className="w-full sm:w-auto min-w-[270px] transform-gpu">
              <ActionCard 
                icon={card.icon}
                title={card.title}
                description={card.description}
                buttonText={card.buttonText}
                buttonVariant={card.buttonVariant}
                onClick={card.onClick}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
