
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyPlaceholderProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  };
}

export function EmptyPlaceholder({
  icon,
  title,
  description,
  action
}: EmptyPlaceholderProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed bg-card p-8 text-center animate-in fade-in-50 dark:border-gray-700">
      {icon && <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">{icon}</div>}
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="mb-6 max-w-sm text-center text-muted-foreground">{description}</p>
      {action && (
        action.onClick ? (
          <Button
            onClick={action.onClick}
            className="bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark"
          >
            {action.label}
          </Button>
        ) : (
          <Link to={action.href}>
            <Button
              className="bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark"
            >
              {action.label}
            </Button>
          </Link>
        )
      )}
    </div>
  );
}
