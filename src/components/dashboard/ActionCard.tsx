
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?: "default" | "outline";
  onClick: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ 
  icon, 
  title, 
  description, 
  buttonText, 
  buttonVariant = "outline", 
  onClick 
}) => (
  <Card className="group h-full transform transition-all duration-300 shadow-sm hover:shadow-md border-border hover:border-smartinvoice-purple dark:hover:border-smartinvoice-purple flex flex-col card-shadow">
    <CardHeader className="flex flex-row items-center space-x-4 pb-2 p-4">
      <div className="h-12 w-12 rounded-full bg-smartinvoice-soft-gray dark:bg-gray-800 flex items-center justify-center group-hover:bg-smartinvoice-purple/10 transition-colors">
        {icon}
      </div>
      <div>
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="text-xs sm:text-sm text-muted-foreground flex-grow px-4 py-2">
      {description}
    </CardContent>
    <CardFooter className="p-4 pt-2">
      <Button 
        onClick={onClick}
        className={`w-full ${buttonVariant === "default" ? "bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark text-white" : "bg-card hover:bg-muted text-foreground border border-input"}`}
        variant={buttonVariant}
        size="sm"
      >
        {buttonText}
      </Button>
    </CardFooter>
  </Card>
);

export default ActionCard;
