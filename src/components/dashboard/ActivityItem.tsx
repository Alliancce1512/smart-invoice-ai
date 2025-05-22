
import React from "react";

export interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  time: string;
  description: string;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ icon, title, time, description }) => (
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

export default ActivityItem;
