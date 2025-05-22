
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { FileUp, FileText, ListChecks, Check, CheckCheck } from "lucide-react";
import ActionCard from "./ActionCard";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { accessConfig } = useAuth();
  const isMobile = useIsMobile();
  
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
    <div className="px-4 sm:px-6 py-6">
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-6">
            {filteredActionCards.map((card, index) => (
              <CarouselItem 
                key={index} 
                className="pl-6 basis-full sm:basis-1/2 md:basis-1/3"
              >
                <div className="h-full">
                  <ActionCard 
                    icon={card.icon}
                    title={card.title}
                    description={card.description}
                    buttonText={card.buttonText}
                    buttonVariant={card.buttonVariant}
                    onClick={card.onClick}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="flex justify-center mt-6 gap-4">
            <CarouselPrevious className="static transform-none inline-flex bg-background border-input hover:bg-accent hover:text-accent-foreground shadow-sm" />
            <CarouselNext className="static transform-none inline-flex bg-background border-input hover:bg-accent hover:text-accent-foreground shadow-sm" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default QuickActions;
