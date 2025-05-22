
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Zap, TrendingUp, Clock, CheckCircle } from "lucide-react";

export const FeaturesSection: React.FC = () => {
  return (
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
            <CardHeader className="bg-gradient-to-r from-smartinvoice-soft-gray/30 to-background border-b dark:from-gray-800/50 dark:to-gray-900/30">
              <CardTitle className="text-foreground dark:text-white">Key Features</CardTitle>
              <CardDescription>What makes SmartInvoice AI powerful</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3 bg-card p-4 rounded-lg border border-border/40 hover:border-smartinvoice-purple/30 transition-colors hover:shadow-sm">
                  <div className="mt-0.5 text-smartinvoice-purple bg-smartinvoice-purple/10 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground dark:text-white">Intelligent OCR</h4>
                    <p className="text-sm text-muted-foreground">Extract data from any invoice format with high accuracy</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-card p-4 rounded-lg border border-border/40 hover:border-smartinvoice-purple/30 transition-colors hover:shadow-sm">
                  <div className="mt-0.5 text-smartinvoice-purple bg-smartinvoice-purple/10 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground dark:text-white">Data Validation</h4>
                    <p className="text-sm text-muted-foreground">Automatic verification of invoice data and calculations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-card p-4 rounded-lg border border-border/40 hover:border-smartinvoice-purple/30 transition-colors hover:shadow-sm">
                  <div className="mt-0.5 text-smartinvoice-purple bg-smartinvoice-purple/10 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground dark:text-white">Approval Workflow</h4>
                    <p className="text-sm text-muted-foreground">Streamlined process for reviewing and approving invoices</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-card p-4 rounded-lg border border-border/40 hover:border-smartinvoice-purple/30 transition-colors hover:shadow-sm">
                  <div className="mt-0.5 text-smartinvoice-purple bg-smartinvoice-purple/10 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground dark:text-white">Secure Storage</h4>
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
              <CardTitle className="text-foreground dark:text-white">Business Benefits</CardTitle>
              <CardDescription>How SmartInvoice AI saves you time and money</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3 bg-card p-4 rounded-lg border border-border/40 hover:border-green-300/30 transition-colors hover:shadow-sm">
                  <div className="mt-0.5 text-green-500 bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground dark:text-white">Increased Efficiency</h4>
                    <p className="text-sm text-muted-foreground">Reduce manual data entry by up to 90% with automated extraction</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-card p-4 rounded-lg border border-border/40 hover:border-green-300/30 transition-colors hover:shadow-sm">
                  <div className="mt-0.5 text-green-500 bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground dark:text-white">Time Savings</h4>
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
              <CardTitle className="text-foreground dark:text-white">System Statistics</CardTitle>
              <CardDescription>Processing performance and accuracy</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-gradient-to-br from-smartinvoice-soft-gray/40 to-background rounded-lg border border-border/40 dark:from-gray-800/40 dark:to-gray-900/20">
                  <div className="text-3xl font-bold text-smartinvoice-purple">99%</div>
                  <div className="text-sm text-muted-foreground mt-1">Accuracy Rate</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-smartinvoice-soft-gray/40 to-background rounded-lg border border-border/40 dark:from-gray-800/40 dark:to-gray-900/20">
                  <div className="text-3xl font-bold text-smartinvoice-purple">~5s</div>
                  <div className="text-sm text-muted-foreground mt-1">Avg. Processing Time</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-smartinvoice-soft-gray/40 to-background rounded-lg border border-border/40 dark:from-gray-800/40 dark:to-gray-900/20">
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
              <CardTitle className="text-foreground dark:text-white">Recent Updates</CardTitle>
              <CardDescription>Latest system updates and features</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="border-l-2 border-smartinvoice-purple pl-4 py-2 hover:bg-muted/30 rounded-r-lg transition-colors">
                  <p className="text-sm text-foreground dark:text-gray-200">New feature: Multi-currency support for international invoices</p>
                  <p className="text-xs text-muted-foreground/70">Added 3 days ago</p>
                </div>
                <div className="border-l-2 border-smartinvoice-purple pl-4 py-2 hover:bg-muted/30 rounded-r-lg transition-colors">
                  <p className="text-sm text-foreground dark:text-gray-200">New feature: Enhanced data extraction for complex layouts</p>
                  <p className="text-xs text-muted-foreground/70">Added 1 week ago</p>
                </div>
                <div className="border-l-2 border-smartinvoice-purple pl-4 py-2 hover:bg-muted/30 rounded-r-lg transition-colors">
                  <p className="text-sm text-foreground dark:text-gray-200">System update: Improved processing speed by 35%</p>
                  <p className="text-xs text-muted-foreground/70">2 weeks ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeaturesSection;
