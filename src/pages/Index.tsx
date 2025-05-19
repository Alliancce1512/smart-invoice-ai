import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Upload, FileText, TrendingUp, Clock, FileCheck, Star, Zap, Check, CheckCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SuccessMessage {
  vendor: string;
  action: 'submitted' | 'approved';
}

// Define a common interface for action cards
interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?: "default" | "outline";
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ 
  icon, 
  title, 
  description, 
  buttonText, 
  buttonVariant = "outline", 
  onClick 
}) => (
  <Card className="group transition-all duration-300 border-border hover:border-smartinvoice-purple dark:hover:border-smartinvoice-purple min-w-[250px] md:min-w-[280px] flex flex-col">
    <CardHeader className="flex flex-row items-center space-x-4 pb-2">
      <div className="h-12 w-12 rounded-full bg-smartinvoice-soft-gray dark:bg-gray-800 flex items-center justify-center">
        {icon}
      </div>
      <div className="space-y-1">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
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

const Index = () => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState<SuccessMessage | null>(null);
  const navigate = useNavigate();
  const { accessConfig } = useAuth();
  
  useEffect(() => {
    // Check for success message in session storage
    const messageJson = sessionStorage.getItem("invoiceSuccessMessage");
    if (messageJson) {
      try {
        const message = JSON.parse(messageJson) as SuccessMessage;
        setSuccessMessage(message);
        setShowSuccessDialog(true);
        // Clear the message so it doesn't show again on refresh
        sessionStorage.removeItem("invoiceSuccessMessage");
      } catch (error) {
        console.error("Failed to parse success message:", error);
      }
    }
  }, []);
  
  const handleProcessAnother = () => {
    setShowSuccessDialog(false);
    navigate("/upload");
  };

  // Action card data with role-based filtering applied later
  const actionCards = [
    {
      icon: <Upload className="h-6 w-6 text-smartinvoice-purple" />,
      title: "Process Invoice",
      description: "Upload and extract data",
      buttonText: "Upload Now",
      buttonVariant: "default" as const,
      onClick: () => navigate("/upload"),
      requiredRole: null, // Available to all
    },
    {
      icon: <FileText className="h-6 w-6 text-smartinvoice-purple" />,
      title: "View Submissions",
      description: "Track your invoices",
      buttonText: "View Invoices",
      onClick: () => navigate("/requests"),
      requiredRole: null, // Available to all
    },
    {
      icon: <FileCheck className="h-6 w-6 text-smartinvoice-purple" />,
      title: "Start Reviewing",
      description: "Review invoices & send for approval",
      buttonText: "Review Now",
      onClick: () => navigate("/review"),
      requiredRole: "canReviewInvoices",
    },
    {
      icon: <Check className="h-6 w-6 text-smartinvoice-purple" />,
      title: "Approve Invoices",
      description: "Final invoice approval",
      buttonText: "Approve Now",
      onClick: () => navigate("/approve"),
      requiredRole: "canApproveInvoices",
    },
    {
      icon: <CheckCheck className="h-6 w-6 text-smartinvoice-purple" />,
      title: "Approved Requests",
      description: "View approved invoices",
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
    <Layout>
      <div className="w-full max-w-5xl mx-auto py-8 space-y-12">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground tracking-tight">
            Welcome to <span className="text-smartinvoice-purple">SmartInvoice AI</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Automate your invoice processing with powerful AI recognition
          </p>
        </div>

        {/* Quick action cards with professional ScrollArea */}
        <div className="relative px-1 md:px-4">
          <ScrollArea className="w-full pb-4">
            <div className="flex gap-6 pb-4 overflow-visible">
              {filteredActionCards.map((card, index) => (
                <div key={index} className="flex-shrink-0 transform transition-transform hover:scale-105 hover:z-10">
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
          </ScrollArea>
        </div>
        
        {/* Features section */}
        <div className="pt-6">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-none h-auto">
              <TabsTrigger value="features" className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>Features</span>
              </TabsTrigger>
              <TabsTrigger value="benefits" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Benefits</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Stats</span>
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Recent Activity</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                  <CardDescription>What makes SmartInvoice AI powerful</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 text-smartinvoice-purple">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Intelligent OCR</h4>
                        <p className="text-sm text-muted-foreground">Extract data from any invoice format with high accuracy</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 text-smartinvoice-purple">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Data Validation</h4>
                        <p className="text-sm text-muted-foreground">Automatic verification of invoice data and calculations</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 text-smartinvoice-purple">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Approval Workflow</h4>
                        <p className="text-sm text-muted-foreground">Streamlined process for reviewing and approving invoices</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 text-smartinvoice-purple">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Secure Storage</h4>
                        <p className="text-sm text-muted-foreground">Encrypted document storage and processing</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="benefits" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Benefits</CardTitle>
                  <CardDescription>How SmartInvoice AI saves you time and money</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 text-green-500">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Increased Efficiency</h4>
                        <p className="text-sm text-muted-foreground">Reduce manual data entry by up to 90% with automated extraction</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 text-green-500">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Time Savings</h4>
                        <p className="text-sm text-muted-foreground">Process invoices in seconds instead of minutes or hours</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Statistics</CardTitle>
                  <CardDescription>Processing performance and accuracy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
                    <div className="p-4 bg-muted/40 rounded-lg">
                      <div className="text-3xl font-bold text-smartinvoice-purple">99%</div>
                      <div className="text-sm text-muted-foreground mt-1">Accuracy Rate</div>
                    </div>
                    <div className="p-4 bg-muted/40 rounded-lg">
                      <div className="text-3xl font-bold text-smartinvoice-purple">~5s</div>
                      <div className="text-sm text-muted-foreground mt-1">Avg. Processing Time</div>
                    </div>
                    <div className="p-4 bg-muted/40 rounded-lg">
                      <div className="text-3xl font-bold text-smartinvoice-purple">50+</div>
                      <div className="text-sm text-muted-foreground mt-1">Supported Languages</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recent" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system updates and features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-2 border-smartinvoice-purple pl-4 py-1">
                      <p className="text-sm text-muted-foreground">New feature: Multi-currency support for international invoices</p>
                      <p className="text-xs text-muted-foreground/70">Added 3 days ago</p>
                    </div>
                    <div className="border-l-2 border-smartinvoice-purple pl-4 py-1">
                      <p className="text-sm text-muted-foreground">New feature: Enhanced data extraction for complex layouts</p>
                      <p className="text-xs text-muted-foreground/70">Added 1 week ago</p>
                    </div>
                    <div className="border-l-2 border-smartinvoice-purple pl-4 py-1">
                      <p className="text-sm text-muted-foreground">System update: Improved processing speed by 35%</p>
                      <p className="text-xs text-muted-foreground/70">2 weeks ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Success dialog after submission */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
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
              onClick={handleProcessAnother} 
              className="bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark"
            >
              Process Another Invoice
            </Button>
            <Button 
              onClick={() => setShowSuccessDialog(false)} 
              variant="outline"
              className="dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Index;
