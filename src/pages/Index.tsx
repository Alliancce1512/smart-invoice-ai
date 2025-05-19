
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Upload, FileText, TrendingUp, Clock, FileCheck, Star, Zap, Check, CheckCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SuccessMessage {
  vendor: string;
  action: 'submitted' | 'approved';
}

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

        {/* Quick action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-auto justify-center">
          <Card className="group hover-scale border-border hover:border-smartinvoice-purple transition-all duration-300 dark:hover:border-smartinvoice-purple">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className="h-12 w-12 rounded-full bg-smartinvoice-soft-gray dark:bg-gray-800 flex items-center justify-center">
                <Upload className="h-6 w-6 text-smartinvoice-purple" />
              </div>
              <div className="space-y-1">
                <CardTitle>Process Invoice</CardTitle>
                <CardDescription>Upload and extract data</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Upload your invoice and let our AI extract all important information automatically.
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate("/upload")}
                className="w-full bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark text-white"
              >
                Upload Now
              </Button>
            </CardFooter>
          </Card>

          <Card className="group hover-scale border-border hover:border-smartinvoice-purple transition-all duration-300 dark:hover:border-smartinvoice-purple">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className="h-12 w-12 rounded-full bg-smartinvoice-soft-gray dark:bg-gray-800 flex items-center justify-center">
                <FileText className="h-6 w-6 text-smartinvoice-purple" />
              </div>
              <div className="space-y-1">
                <CardTitle>View Submissions</CardTitle>
                <CardDescription>Track your invoices</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              View all your submitted invoices and check their current approval status.
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate("/requests")}
                className="w-full bg-card hover:bg-muted text-foreground border border-input"
                variant="outline"
              >
                View Invoices
              </Button>
            </CardFooter>
          </Card>

          {accessConfig?.canApproveInvoices && (
            <Card className="group hover-scale border-border hover:border-smartinvoice-purple transition-all duration-300 dark:hover:border-smartinvoice-purple">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <div className="h-12 w-12 rounded-full bg-smartinvoice-soft-gray dark:bg-gray-800 flex items-center justify-center">
                  <FileCheck className="h-6 w-6 text-smartinvoice-purple" />
                </div>
                <div className="space-y-1">
                  <CardTitle>Start Reviewing</CardTitle>
                  <CardDescription>Review invoices & send for approval</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Review invoices and send them for final approval from authorized approvers.
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate("/review")}
                  className="w-full bg-card hover:bg-muted text-foreground border border-input"
                  variant="outline"
                >
                  Review Now
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {accessConfig?.canApproveInvoices && (
            <Card className="group hover-scale border-border hover:border-smartinvoice-purple transition-all duration-300 dark:hover:border-smartinvoice-purple">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <div className="h-12 w-12 rounded-full bg-smartinvoice-soft-gray dark:bg-gray-800 flex items-center justify-center">
                  <Check className="h-6 w-6 text-smartinvoice-purple" />
                </div>
                <div className="space-y-1">
                  <CardTitle>Approve Invoices</CardTitle>
                  <CardDescription>Final invoice approval</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Give final approval for invoices that have been reviewed and are ready for processing.
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate("/approve")}
                  className="w-full bg-card hover:bg-muted text-foreground border border-input"
                  variant="outline"
                >
                  Approve Now
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <Card className="group hover-scale border-border hover:border-smartinvoice-purple transition-all duration-300 dark:hover:border-smartinvoice-purple">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className="h-12 w-12 rounded-full bg-smartinvoice-soft-gray dark:bg-gray-800 flex items-center justify-center">
                <CheckCheck className="h-6 w-6 text-smartinvoice-purple" />
              </div>
              <div className="space-y-1">
                <CardTitle>Approved Requests</CardTitle>
                <CardDescription>View approved invoices</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Review all invoices that have been fully approved and are ready for payment.
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate("/approved")}
                className="w-full bg-card hover:bg-muted text-foreground border border-input"
                variant="outline"
              >
                View Approved
              </Button>
            </CardFooter>
          </Card>
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

      {/* Success dialog after submission - with switched button order */}
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
