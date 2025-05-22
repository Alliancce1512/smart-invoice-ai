
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
  <Card className="group transform transition-all duration-300 shadow-sm hover:shadow-md border-border hover:border-smartinvoice-purple dark:hover:border-smartinvoice-purple min-w-[250px] md:min-w-[280px] flex flex-col card-shadow">
    <CardHeader className="flex flex-row items-center space-x-4 pb-2">
      <div className="h-12 w-12 rounded-full bg-smartinvoice-soft-gray dark:bg-gray-800 flex items-center justify-center group-hover:bg-smartinvoice-purple/10 transition-colors">
        {icon}
      </div>
      <div className="space-y-1">
        <CardTitle>{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground flex-grow">
      {description}
    </CardContent>
    <CardFooter>
      <Button 
        onClick={onClick}
        className={`w-full ${buttonVariant === "default" ? "bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark text-white" : "bg-card hover:bg-muted text-foreground border border-input"}`}
        variant={buttonVariant}
      >
        {buttonText}
      </Button>
    </CardFooter>
  </Card>
);

export default ActionCard;
