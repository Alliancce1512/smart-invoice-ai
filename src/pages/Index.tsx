
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, ClipboardCheck, FileText, CheckSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardWidget = ({ 
  title, 
  description, 
  icon, 
  linkText, 
  linkUrl 
}: { 
  title: string;
  description: string;
  icon: React.ReactNode;
  linkText: string;
  linkUrl: string;
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={linkUrl}>{linkText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const Index = () => {
  const { accessConfig } = useAuth();
  
  const canReview = accessConfig?.canReviewInvoices || false;
  const canApprove = accessConfig?.canApproveInvoices || false;

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <Tabs defaultValue="quick-access">
          <TabsList className="mb-8">
            <TabsTrigger value="quick-access">Quick Access</TabsTrigger>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quick-access" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Upload Invoice - Available to all users */}
              <DashboardWidget
                title="Upload Invoice"
                description="Upload a new invoice for processing."
                icon={<FileUp className="h-5 w-5" />}
                linkText="Upload New"
                linkUrl="/upload"
              />
              
              {/* My Requests - Available to all users */}
              <DashboardWidget
                title="My Requests"
                description="View and track all your invoice submissions."
                icon={<FileText className="h-5 w-5" />}
                linkText="View Requests"
                linkUrl="/requests"
              />
              
              {/* Review Invoices - Only for users with canReviewInvoices permission */}
              {canReview && (
                <DashboardWidget
                  title="Review Invoices"
                  description="Review submitted invoices and prepare them for approval."
                  icon={<ClipboardCheck className="h-5 w-5" />}
                  linkText="Review"
                  linkUrl="/review"
                />
              )}
              
              {/* Approve Invoices - Only for users with canApproveInvoices permission */}
              {canApprove && (
                <DashboardWidget
                  title="Approve Invoices"
                  description="Approve or decline invoices sent for final approval."
                  icon={<CheckSquare className="h-5 w-5" />}
                  linkText="Approve"
                  linkUrl="/approve"
                />
              )}
              
              {/* Approved Requests - Only for users with canApproveInvoices permission */}
              {canApprove && (
                <DashboardWidget
                  title="Approved Requests"
                  description="View all approved invoice requests."
                  icon={<FileText className="h-5 w-5" />}
                  linkText="View Approved"
                  linkUrl="/approved"
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="recent">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Recent activity data will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
