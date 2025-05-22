
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { FileUp, FileText, ListChecks, Check, CheckCheck, ArrowLeft, ArrowRight } from "lucide-react";
import ActionCard from "./ActionCard";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

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
      <div className="py-4 relative">
        {/* Carousel for infinite scrolling */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="py-1">
            {filteredActionCards.map((card, index) => (
              <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4 first:pl-4">
                <div className="h-full min-w-[290px]">
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
          
          {/* Custom Carousel Navigation - Repositioned for better visibility */}
          <div className="hidden sm:flex">
            <CarouselPrevious className="-left-12 bg-background border-input hover:bg-accent hover:text-accent-foreground shadow-sm" />
            <CarouselNext className="-right-12 bg-background border-input hover:bg-accent hover:text-accent-foreground shadow-sm" />
          </div>
          
          {/* Mobile Navigation Buttons */}
          <div className="flex justify-center gap-2 mt-4 sm:hidden">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
              onClick={() => {
                const prevButton = document.querySelector('[data-carousel-prev]') as HTMLButtonElement;
                if (prevButton) prevButton.click();
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
              onClick={() => {
                const nextButton = document.querySelector('[data-carousel-next]') as HTMLButtonElement;
                if (nextButton) nextButton.click();
              }}
            >
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
          
          {/* Improved fade effects - extending full height */}
          <div className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none bg-gradient-to-r from-background to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none bg-gradient-to-l from-background to-transparent z-10"></div>
        </Carousel>
      </div>
    </div>
  );
};

export default QuickActions;
