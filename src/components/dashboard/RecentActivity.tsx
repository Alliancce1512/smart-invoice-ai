
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, Activity } from "lucide-react";
import ActivityItem from "./ActivityItem";

// Sample recent activity data
export const recentActivities = [
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

export const RecentActivity: React.FC = () => {
  return (
    <div className="pt-2">
      <div className="mb-3">
        <h2 className="text-2xl font-semibold mb-2 text-foreground dark:text-white">Recent Activity</h2>
        <p className="text-muted-foreground">Your latest invoice processing activities</p>
      </div>
      
      <Card className="border-border shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
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
        <CardFooter className="px-4 py-3 border-t border-border">
          <Button variant="ghost" size="sm" className="ml-auto text-smartinvoice-purple hover:text-smartinvoice-purple-dark hover:bg-smartinvoice-purple/10">
            View All Activity
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecentActivity;
