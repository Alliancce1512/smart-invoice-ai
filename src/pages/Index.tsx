
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Upload, FileText, TrendingUp, Clock, FileCheck, Star, Zap, Check, CheckCheck, Activity, FileUp, ListChecks } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea, HorizontalScrollArea } from "@/components/ui/scroll-area";
import { formatDateTime, formatTimeElapsed } from "@/utils/formatters";

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
  <Card className="group hover:scale-[1.02] border-border hover:border-smartinvoice-purple transition-all duration-300 shadow-sm hover:shadow-md dark:hover:border-smartinvoice-purple min-w-[250px] md:min-w-[280px] flex flex-col">
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

// A simple activity item component
const ActivityItem = ({ icon, title, time, description }) => (
  <div className="flex items-start space-x-3 p-3 rounded-lg transition-colors hover:bg-muted/50">
    <div className="mt-0.5 text-smartinvoice-purple bg-smartinvoice-purple/10 p-2 rounded-full">
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h4 className="font-medium">{title}</h4>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

// Sample recent activity data
const recentActivities = [
  {
    icon: <Upload className="h-4 w-4" />,
    title: "Invoice Uploaded",
    time: "Today",
    description: "You uploaded an invoice from CloudTech Services for $1,299.00"
  },
  {
    icon: <CheckCircle className="h-4 w-4" />,
    title: "Invoice Approved",
    time: "Yesterday",
    description: "Your invoice from Marketing Solutions was approved"
  },
  {
    icon: <Activity className="h-4 w-4" />,
    title: "Status Change",
    time: "2 days ago",
    description: "Invoice #INV-2023-004 status changed to 'Under Review'"
  }
];

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
    <Layout>
      <div className="w-full max-w-5xl mx-auto py-4 space-y-6">
        {/* Subtitle/tagline section with decorative background */}
        <div className="text-center mb-4 relative py-6 px-4 rounded-2xl overflow-hidden">
          {/* Decorative gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-smartinvoice-soft-gray/50 to-background z-0 opacity-70"></div>
          
          {/* Content */}
          <div className="relative z-10">
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Automate your invoice processing with powerful AI recognition
            </p>
          </div>
        </div>

        {/* Quick action cards - horizontally scrollable with snap */}
        <div className="relative">
          <HorizontalScrollArea className="py-2">
            <div className="flex gap-5 snap-x snap-mandatory px-1">
              {filteredActionCards.map((card, index) => (
                <div key={index} className="snap-center flex-shrink-0">
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
          </HorizontalScrollArea>
        </div>
        
        {/* Recent Activity section */}
        <div className="pt-2">
          <div className="mb-3">
            <h2 className="text-2xl font-semibold mb-2">Recent Activity</h2>
            <p className="text-muted-foreground">Your latest invoice processing activities</p>
          </div>
          
          <Card className="border-border shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="divide-y">
                {recentActivities.map((activity, index) => (
                  <ActivityItem 
                    key={index}
                    icon={activity.icon}
                    title={activity.title}
                    time={activity.time}
                    description={activity.description}
                  />
                ))}
              </div>
            </CardContent>
            <CardFooter className="px-4 py-3 border-t">
              <Button variant="ghost" size="sm" className="ml-auto text-smartinvoice-purple hover:text-smartinvoice-purple-dark hover:bg-smartinvoice-purple/10">
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Features section with improved visuals */}
        <div className="pt-2">
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
                <span>Recent Updates</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="mt-4">
              <Card className="border shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-smartinvoice-soft-gray/30 to-background border-b">
                  <CardTitle>Key Features</CardTitle>
                  <CardDescription>What makes SmartInvoice AI powerful</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3 bg-card p-4 rounded-lg border border-border/40 hover:border-smartinvoice-purple/30 transition-colors">
                      <div className="mt-0.5 text-smartinvoice-purple bg-smartinvoice-purple/10 p-2 rounded-full">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Intelligent OCR</h4>
                        <p className="text-sm text-muted-foreground">Extract data from any invoice format with high accuracy</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 bg-card p-4 rounded-lg border border-border/40 hover:border-smartinvoice-purple/30 transition-colors">
                      <div className="mt-0.5 text-smartinvoice-purple bg-smartinvoice-purple/10 p-2 rounded-full">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Data Validation</h4>
                        <p className="text-sm text-muted-foreground">Automatic verification of invoice data and calculations</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 bg-card p-4 rounded-lg border border-border/40 hover:border-smartinvoice-purple/30 transition-colors">
                      <div className="mt-0.5 text-smartinvoice-purple bg-smartinvoice-purple/10 p-2 rounded-full">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Approval Workflow</h4>
                        <p className="text-sm text-muted-foreground">Streamlined process for reviewing and approving invoices</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 bg-card p-4 rounded-lg border border-border/40 hover:border-smartinvoice-purple/30 transition-colors">
                      <div className="mt-0.5 text-smartinvoice-purple bg-smartinvoice-purple/10 p-2 rounded-full">
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
            
            <TabsContent value="benefits" className="mt-4">
              <Card className="border shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-green-50 to-background border-b dark:from-green-950/20 dark:to-background">
                  <CardTitle>Business Benefits</CardTitle>
                  <CardDescription>How SmartInvoice AI saves you time and money</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 bg-card p-4 rounded-lg border border-border/40 hover:border-green-300/30 transition-colors">
                      <div className="mt-0.5 text-green-500 bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Increased Efficiency</h4>
                        <p className="text-sm text-muted-foreground">Reduce manual data entry by up to 90% with automated extraction</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 bg-card p-4 rounded-lg border border-border/40 hover:border-green-300/30 transition-colors">
                      <div className="mt-0.5 text-green-500 bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
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
            
            <TabsContent value="stats" className="mt-4">
              <Card className="border shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-blue-50/50 to-background border-b dark:from-blue-950/20 dark:to-background">
                  <CardTitle>System Statistics</CardTitle>
                  <CardDescription>Processing performance and accuracy</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
                    <div className="p-4 bg-gradient-to-br from-smartinvoice-soft-gray/40 to-background rounded-lg border border-border/40">
                      <div className="text-3xl font-bold text-smartinvoice-purple">99%</div>
                      <div className="text-sm text-muted-foreground mt-1">Accuracy Rate</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-smartinvoice-soft-gray/40 to-background rounded-lg border border-border/40">
                      <div className="text-3xl font-bold text-smartinvoice-purple">~5s</div>
                      <div className="text-sm text-muted-foreground mt-1">Avg. Processing Time</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-smartinvoice-soft-gray/40 to-background rounded-lg border border-border/40">
                      <div className="text-3xl font-bold text-smartinvoice-purple">50+</div>
                      <div className="text-sm text-muted-foreground mt-1">Supported Languages</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recent" className="mt-4">
              <Card className="border shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-purple-50/50 to-background border-b dark:from-purple-950/20 dark:to-background">
                  <CardTitle>Recent Updates</CardTitle>
                  <CardDescription>Latest system updates and features</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="border-l-2 border-smartinvoice-purple pl-4 py-2 hover:bg-muted/30 rounded-r-lg transition-colors">
                      <p className="text-sm text-muted-foreground">New feature: Multi-currency support for international invoices</p>
                      <p className="text-xs text-muted-foreground/70">Added 3 days ago</p>
                    </div>
                    <div className="border-l-2 border-smartinvoice-purple pl-4 py-2 hover:bg-muted/30 rounded-r-lg transition-colors">
                      <p className="text-sm text-muted-foreground">New feature: Enhanced data extraction for complex layouts</p>
                      <p className="text-xs text-muted-foreground/70">Added 1 week ago</p>
                    </div>
                    <div className="border-l-2 border-smartinvoice-purple pl-4 py-2 hover:bg-muted/30 rounded-r-lg transition-colors">
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
